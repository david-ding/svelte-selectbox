<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
  import { convertLengthToPx, generateHtmlId } from './_utils/dom-utils';
  import stringUtils from './_utils/string-utils';
  import Chevron from './Chevron.svelte';
  import Cross from './Cross.svelte';
  import Dropdown, { DROPDOWN_CSS_CUSTOM_PROPERTIES } from './Dropdown.svelte';
  import Portal from './Portal.svelte';
  import Wrapper from './Wrapper.svelte';

  import type { DropdownDirection, Position, SelectOption } from './types';

  export let appendTo: string | undefined = undefined;
  export let direction: DropdownDirection = 'auto';
  export let disabled: boolean = false;
  export let dropdownHeight: string | undefined = undefined;
  export let htmlId: string = generateHtmlId();
  export let itemHeight: string = '3rem';
  export let maxItems: number = 5;
  export let name: string | null | undefined = undefined;
  export let optionKeyFn: (option: SelectOption) => unknown = (option) => option.label;
  export let options: Array<SelectOption> = [];
  export let placeholder: string | undefined = undefined;
  export let searchFn: ((query: string) => void) | undefined = undefined;
  export let searchable: boolean = false;
  export let showChevron: boolean = true;
  export let showEmptyResults: boolean = true;
  export let value: unknown = undefined;
  export let valueFormatterFn: ((value: unknown) => string) | undefined = undefined;
  export let yOffset: string = '1rem';

  let container: HTMLElement | null | undefined = undefined;
  let dropUp: boolean = false;
  let dropdownComponent: Dropdown | undefined = undefined;
  let dropdownHeightPx: number = 0;
  let dropdownHtmlId: string = generateHtmlId();
  let expanded: boolean = false;
  let filteredOptions: Array<SelectOption> = [];
  let focused: boolean = false;
  let formattedValue: string = '';
  let highlightedOptionId: string | undefined = undefined;
  let inputElement: HTMLInputElement | undefined = undefined;
  let itemHeightPx: number = 0;
  let position: Position = { left: -99999, top: -99999 };
  let searching: boolean = false;
  let selectorElement: HTMLElement | undefined = undefined;
  let width: number = 0;

  $: filteredOptions = options;
  $: formattedValue = formatValue(value);
  $: {
    if (dropdownHeight) {
      dropdownHeightPx =
        (selectorElement && convertLengthToPx(dropdownHeight, selectorElement)) || 0;
    }
  }
  $: {
    if (itemHeight) {
      itemHeightPx = (selectorElement && convertLengthToPx(itemHeight, selectorElement)) || 0;
    }
  }
  $: {
    if (container && selectorElement) {
      toggleDropdown(expanded);
    }
  }

  const dispatch = createEventDispatcher();

  const toggleDropdown = (expanded: boolean) => {
    if (expanded) {
      _asyncResetPosition();

      container?.addEventListener('scroll', handleScroll);
      inputElement?.focus();
    } else {
      container?.removeEventListener('scroll', handleScroll);
    }
  };

  const handleScroll = () => {
    _resetPosition();
  };

  const handleSelectorClick = () => {
    if (disabled) return;
    expanded = !expanded;
  };

  const handleClearClick = () => {
    _clearResults();
    inputElement?.focus();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!focused) return;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Enter': {
        event.preventDefault();
        expanded = true;
        break;
      }
      case 'Backspace':
      case 'Delete': {
        if (!inputElement?.value) {
          _clearResults();
        }
        break;
      }
      case 'Tab': {
        _resetSelect();
        break;
      }
      case 'Escape': {
        expanded = false;
        break;
      }
    }
  };

  const handleFocus = () => {
    focused = true;
  };

  const handleInput = () => {
    expanded = true;
    searching = true;

    if (!inputElement) return;

    if (searchFn) {
      searchFn(inputElement.value);
      return;
    }

    const searchRegexp = new RegExp(stringUtils.escapeRegExp(inputElement.value) || '', 'i');
    filteredOptions = options.filter((option) =>
      searchRegexp.test(stringUtils.removeAccents(option.label)),
    );
  };

  const handleWindowResize = () => {
    _resetWidth();
    _resetPosition();
  };

  const handleSelect = (selectEvent: CustomEvent<SelectOption>) => {
    value = selectEvent.detail?.value;
    expanded = false;

    _resetInput();
    inputElement?.focus();
    dispatch('select', selectEvent.detail);
  };

  const handleOutsideClick = () => {
    _resetSelect();
  };

  const handleHighlight = (highlightEvent: CustomEvent<number>) => {
    highlightedOptionId = expanded ? `${dropdownHtmlId}-${highlightEvent.detail}` : undefined;
  };

  const checkAndHandleOutsideClick = (event: MouseEvent) => {
    if (!focused || selectorElement?.contains(event.target as HTMLElement) || dropdownComponent) {
      return;
    }

    handleOutsideClick();
  };

  const formatValue = (value: unknown): string => {
    if (valueFormatterFn) {
      return valueFormatterFn(value);
    }
    return options.find((option) => option.value === value)?.label || value?.toString() || '';
  };

  const getDropdownWrapperStyle = (): string => {
    if (!appendTo || !selectorElement) {
      return '';
    }

    // Yuck...
    // all these to make sure the css custom properties are passed to the dropdown
    // when it's appended to another container.
    // there may be a better way...
    const selectorStyle = getComputedStyle(selectorElement);
    const dropdownCssCustomProperties = DROPDOWN_CSS_CUSTOM_PROPERTIES.map((property) => {
      const propertyValue = selectorStyle.getPropertyValue(property);
      return propertyValue && `${property}: ${propertyValue}`;
    }).filter(Boolean);

    if (!dropdownCssCustomProperties.length) {
      return '';
    }

    return ['display: contents', ...dropdownCssCustomProperties].join('; ');
  };

  const _resetInput = () => {
    if (inputElement) {
      searching = false;
      inputElement.value = '';

      filteredOptions = options;
    }
  };

  const _clearResults = () => {
    value = undefined;
    _resetInput();

    dispatch('clear');
  };

  const _xPosition = (): Partial<Position> => {
    if (!selectorElement) return {};

    const selectorRect = selectorElement.getBoundingClientRect();
    return {
      left: appendTo
        ? selectorRect.left
        : -1 * parseFloat(getComputedStyle(selectorElement).borderLeftWidth || '0'),
    };
  };

  const _yPosition = (fixedDirection: boolean = false): Partial<Position> => {
    if (!selectorElement) return {};

    const selectorRect = selectorElement.getBoundingClientRect();
    const yOffsetPx = convertLengthToPx(yOffset, selectorElement);

    if (!fixedDirection) {
      if (direction === 'auto') {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const offsetTop = selectorRect.top + window.scrollY + yOffsetPx;
        const height = selectorRect.height;
        const dropdownHeight = (document.querySelector('.svelte-selectbox-dropdown') as HTMLElement)
          ?.offsetHeight;

        dropUp =
          offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight;
      } else {
        dropUp = direction === 'up';
      }
    }

    const parentElement = appendTo ? document.querySelector(appendTo) : selectorElement;
    if (!parentElement) return {};

    const parentRect = parentElement.getBoundingClientRect();
    if (dropUp) {
      const selectorBottom =
        parentRect.bottom -
        selectorRect.bottom -
        parseFloat(getComputedStyle(selectorElement).borderTopWidth || '0');
      return { bottom: selectorBottom + selectorRect.height + yOffsetPx };
    }

    const selectorTop =
      selectorRect.top -
      parentRect.top -
      parseFloat(getComputedStyle(selectorElement).borderTopWidth || '0');
    return { top: selectorTop + selectorRect.height + yOffsetPx };
  };

  const _resetPosition = () => {
    if (!expanded) return;
    position = {
      ..._xPosition(),
      ..._yPosition(),
    };
  };

  const _asyncResetPosition = async () => {
    await tick();
    _resetPosition();
  };

  const _resetWidth = () => {
    if (!selectorElement) return;

    const selectorRect = selectorElement.getBoundingClientRect();
    width = selectorRect.width;
  };

  const _resetSelect = () => {
    expanded = false;
    focused = false;
    _resetInput();

    dispatch('reset');
  };

  const _detachDropdown = () => {
    dropdownComponent?.$destroy();
    container?.removeEventListener('scroll', handleScroll);
  };

  onMount(() => {
    _resetWidth();
    container = appendTo ? document.querySelector<HTMLElement>(appendTo) : selectorElement;
  });

  onDestroy(_detachDropdown);
</script>

<svelte:window on:mousedown={checkAndHandleOutsideClick} on:resize={handleWindowResize} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="svelte-selectbox"
  class:disabled
  class:expanded
  class:focused
  class:drop-up={dropUp}
  bind:this={selectorElement}
  on:click={handleSelectorClick}
  on:keydown={handleKeydown}
>
  <div class="svelte-selectbox-value-wrapper" data-testid="selector">
    <div class="svelte-selectbox-value" class:searching>
      {#if formattedValue}
        <slot name="value" {formattedValue}>{formattedValue}</slot>
      {:else}
        <div class="svelte-selectbox-value-placeholder">
          {placeholder || ''}
        </div>
      {/if}
    </div>

    <input
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      class="svelte-selectbox-input"
      data-testid="inputElement"
      {disabled}
      id={htmlId}
      {name}
      readonly={!searchable}
      bind:this={inputElement}
      on:focus={handleFocus}
      on:input={handleInput}
      role="combobox"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      aria-expanded={expanded}
      aria-owns={dropdownHtmlId}
      aria-controls={dropdownHtmlId}
      aria-activedescendant={highlightedOptionId}
      aria-live="polite"
      aria-describedby={`${htmlId}-description`}
    />
  </div>

  {#if !!value && !disabled}
    <div
      class="svelte-selectbox-clear"
      on:click|stopPropagation={handleClearClick}
      aria-hidden="true"
    >
      <slot name="clear-icon"><Cross /></slot>
    </div>
  {/if}

  {#if showChevron}
    <div class="svelte-selectbox-arrow" aria-hidden="true">
      <slot name="chevron-icon" {expanded}>
        <Chevron direction={expanded ? 'up' : 'down'} />
      </slot>
    </div>
  {/if}

  <svelte:component
    this={((showEmptyResults || filteredOptions.length) && expanded && Portal) || undefined}
    {appendTo}
  >
    <Wrapper style={getDropdownWrapperStyle}>
      <Dropdown
        options={filteredOptions}
        selectedValue={value}
        {dropdownHeightPx}
        {dropUp}
        htmlId={dropdownHtmlId}
        {itemHeightPx}
        {maxItems}
        {optionKeyFn}
        {position}
        {selectorElement}
        {width}
        bind:this={dropdownComponent}
        on:select={handleSelect}
        on:outsideClick={handleOutsideClick}
        on:highlight={handleHighlight}
      >
        <slot name="item" slot="item" let:option {option}>{option.label}</slot>
        <slot name="no-options-placeholder" slot="no-options-placeholder">No options found</slot>
      </Dropdown>
    </Wrapper>
  </svelte:component>
</div>

<style>
  .svelte-selectbox {
    background-color: var(--background-color, #ffffff);
    border: var(--border, 1px solid #d1d5db); /* gray-300 */
    border-radius: var(--border-radius, 4px);
    box-shadow: var(--box-shadow, none);
    box-sizing: border-box;
    color: var(--color, #1f2937); /* gray-800 */
    cursor: var(--cursor, default);
    display: flex;
    font-size: var(--font-size, 1rem);
    align-items: center;
    line-height: var(--line-height, 2.5rem);
    padding: var(--padding, 0 0.5rem 0 1rem);
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
  }
  .svelte-selectbox-input {
    background-color: var(--background-color, #ffffff);
  }
  .svelte-selectbox:not(.disabled):not(.focused):hover {
    background-color: var(--background-color-hover, var(--background-color, #ffffff));
    border: var(--border-hover, 1px solid #9ca3af); /* gray-400 */
    box-shadow: var(--box-shadow-hover, none);
  }
  .svelte-selectbox:not(.disabled):not(.focused):hover .svelte-selectbox-input {
    background-color: var(--background-color-hover, var(--background-color, #ffffff));
  }
  .svelte-selectbox.focused {
    border: var(--border-focused, 1px solid #60a5fa); /* blue-400 */
    box-shadow: var(--box-shadow-focused, 0 0 4px 0 #60a5fa);
  }
  .svelte-selectbox.expanded {
    border: var(--border-expanded, var(--border-focused, 1px solid #60a5fa)); /* blue-400 */
    border-radius: var(--border-radius-expanded, var(--border-radius, 4px));
    box-shadow: var(--box-shadow-expanded, var(--box-shadow-focused, 0 0 4px 0 #60a5fa));
  }
  .svelte-selectbox.expanded.drop-up {
    border-radius: var(--border-radius-expanded-up, var(--border-radius-expanded, 4px));
    box-shadow: var(--box-shadow-expanded-up, var(--box-shadow-focused, 0 0 4px 0 #60a5fa));
  }
  .svelte-selectbox input {
    border: 0;
    margin: 0;
    padding: 0;
    cursor: var(--cursor, default);
    width: 100%;
    font: inherit;
  }
  .svelte-selectbox input:focus {
    box-shadow: none;
    outline: none;
  }
  .svelte-selectbox.disabled,
  .svelte-selectbox.disabled .svelte-selectbox-input {
    background-color: var(--disabled-background-color, #e5e7eb); /* gray-200 */
  }
  .svelte-selectbox-value-wrapper {
    flex: 1;
    position: relative;
  }
  .svelte-selectbox-value {
    position: absolute;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .svelte-selectbox-value.searching {
    display: none;
  }
  .svelte-selectbox-value-placeholder {
    color: var(--placeholder-color, #d1d5db); /* gray-300 */
  }
  .svelte-selectbox-clear,
  .svelte-selectbox-arrow {
    cursor: pointer;
    display: flex;
  }
  .svelte-selectbox.disabled .svelte-selectbox-arrow {
    color: var(--disabled-select-arrow-color, #9ca3af);
  }
  .svelte-selectbox.disabled .svelte-selectbox-value {
    color: var(--disabled-select-value-color, #9ca3af);
  }
</style>
