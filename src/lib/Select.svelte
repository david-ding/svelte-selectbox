<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";
  import { convertLengthToPx } from "./_utils/dom-utils";
  import stringUtils from "./_utils/string-utils";
  import Chevron from "./Chevron.svelte";
  import Cross from "./Cross.svelte";
  import Dropdown from "./Dropdown.svelte";
  import Portal from "./Portal.svelte";

  import type { DropdownDirection, Position, SelectOption } from "./types";

  export let appendTo: string = null;
  export let direction: DropdownDirection = "auto";
  export let disabled: boolean = false;
  export let htmlId: string = null;
  export let itemHeight: string = "3rem";
  export let maxItems: number = 5;
  export let options: Array<SelectOption> = [];
  export let placeholder: string = null;
  export let searchFn: (query: string) => void = null;
  export let searchable: boolean = false;
  export let showChevron: boolean = true;
  export let showEmptyResults: boolean = true;
  export let value: unknown = null;
  export let valueFormatterFn: (value: unknown) => string = null;
  export let yOffset: string = "1rem";

  let container: HTMLElement = null;
  let dropUp: boolean = false;
  let dropdownComponent: Dropdown = null;
  let expanded: boolean = false;
  let filteredOptions: Array<SelectOption> = [];
  let focused: boolean = false;
  let formattedValue: string = null;
  let inputElement: HTMLInputElement = null;
  let itemHeightPx: number = 0;
  let position: Position = { left: -99999, top: -99999 };
  let searching: boolean = false;
  let selectorElement: HTMLElement = null;
  let width: number = 0;

  $: filteredOptions = options;
  $: formattedValue = formatValue(value);
  $: itemHeightPx =
    selectorElement && convertLengthToPx(itemHeight, selectorElement);
  $: toggleDropdown(expanded);

  const dispatch = createEventDispatcher();

  const toggleDropdown = (expanded: boolean) => {
    if (expanded) {
      _asyncResetPosition();

      container.addEventListener("scroll", handleScroll);
      inputElement?.focus();
    } else {
      container?.removeEventListener("scroll", handleScroll);
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
      case "ArrowUp":
      case "ArrowDown":
      case "Enter": {
        event.preventDefault();
        expanded = true;
        break;
      }
      case "Backspace":
      case "Delete": {
        if (!inputElement?.value) {
          _clearResults();
        }
        break;
      }
      case "Tab": {
        _resetSelect();
        break;
      }
      case "Escape": {
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

    if (searchFn) {
      searchFn(inputElement.value);
      return;
    }

    const searchRegexp = new RegExp(
      stringUtils.escapeRegExp(inputElement.value) || "",
      "i",
    );
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
    dispatch("select", selectEvent.detail);
  };

  const handleOutsideClick = () => {
    _resetSelect();
  };

  const checkAndHandleOutsideClick = (event: MouseEvent) => {
    if (
      !focused ||
      selectorElement.contains(event.target as HTMLElement) ||
      dropdownComponent
    ) {
      return;
    }

    handleOutsideClick();
  };

  const formatValue = (value: unknown): string => {
    if (valueFormatterFn) {
      return valueFormatterFn(value);
    }
    return (
      options.find((option) => option.value === value)?.label ||
      value?.toString()
    );
  };

  const _resetInput = () => {
    if (inputElement != null) {
      searching = false;
      inputElement.value = null;

      filteredOptions = options;
    }
  };

  const _clearResults = () => {
    value = null;
    _resetInput();

    dispatch("clear");
  };

  const _xPosition = (): Partial<Position> => {
    const selectorRect = selectorElement.getBoundingClientRect();
    return {
      left: appendTo
        ? selectorRect.left
        : -1 *
          parseFloat(getComputedStyle(selectorElement).borderLeftWidth || "0"),
    };
  };

  const _yPosition = (fixedDirection: boolean = false): Partial<Position> => {
    const selectorRect = selectorElement.getBoundingClientRect();
    const yOffsetPx = convertLengthToPx(yOffset, selectorElement);

    if (!fixedDirection) {
      if (direction === "auto") {
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        const offsetTop = selectorRect.top + window.pageYOffset + yOffsetPx;
        const height = selectorRect.height;
        const dropdownHeight = (
          document.querySelector(".svelte-selectbox-dropdown") as HTMLElement
        )?.offsetHeight;

        dropUp =
          offsetTop + height + dropdownHeight >
          scrollTop + document.documentElement.clientHeight;
      } else {
        dropUp = direction === "up";
      }
    }

    const selectorTop = appendTo
      ? selectorRect.top
      : -1 *
        parseFloat(getComputedStyle(selectorElement).borderTopWidth || "0");
    const selectorBottom = appendTo
      ? document.documentElement.clientHeight - selectorRect.bottom
      : -1 *
        parseFloat(getComputedStyle(selectorElement).borderTopWidth || "0");
    if (dropUp) {
      return { bottom: selectorBottom + selectorRect.height + yOffsetPx };
    }
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
    const selectorRect = selectorElement.getBoundingClientRect();
    width = selectorRect.width;
  };

  const _resetSelect = () => {
    expanded = false;
    focused = false;
    _resetInput();

    dispatch("reset");
  };

  const _detachDropdown = () => {
    dropdownComponent?.$destroy();
    container?.removeEventListener("scroll", handleScroll);
  };

  onMount(() => {
    _resetWidth();
    container = appendTo ? document.querySelector(appendTo) : selectorElement;
  });

  onDestroy(_detachDropdown);
</script>

<svelte:window
  on:mousedown={checkAndHandleOutsideClick}
  on:keydown={handleKeydown}
  on:resize={handleWindowResize}
/>

<div
  class="svelte-selectbox"
  class:disabled={disabled}
  class:expanded={expanded}
  class:focused={focused}
  class:drop-up={dropUp}
  bind:this={selectorElement}
  on:click={handleSelectorClick}
>
  <div class="svelte-selectbox-value-wrapper" data-testid="selector">
    <div
      class="svelte-selectbox-value"
      class:searching={searching}
    >
      {#if formattedValue}
        <slot name="value" {formattedValue}>{formattedValue}</slot>
      {:else}
        <div class="svelte-selectbox-value-placeholder">
          {placeholder || ""}
        </div>
      {/if}
    </div>

    <input
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      data-testid="inputElement"
      {disabled}
      id={htmlId}
      readonly={!searchable}
      bind:this={inputElement}
      on:focus={handleFocus}
      on:input={handleInput}
    />
  </div>

  {#if !!value && !disabled}
    <div class="svelte-selectbox-clear" on:click={handleClearClick}>
      <Cross />
    </div>
  {/if}

  {#if showChevron}
    <div class="svelte-selectbox-arrow">
      <Chevron direction={expanded ? "up" : "down"} />
    </div>
  {/if}

  <svelte:component
    this={(showEmptyResults || filteredOptions.length) && expanded && Portal}
    {appendTo}
  >
    <Dropdown
      options={filteredOptions}
      selectedValue={value}
      {dropUp}
      {itemHeightPx}
      {maxItems}
      {position}
      {selectorElement}
      {width}
      bind:this={dropdownComponent}
      on:select={handleSelect}
      on:outsideClick={handleOutsideClick}
    />
  </svelte:component>
</div>

<style>
  .svelte-selectbox {
    background-color: var(--backgroundColor, #ffffff);
    border: var(--border, 1px solid #d1d5db); /* gray-300 */
    border-radius: var(--borderRadius, 4px);
    box-shadow: var(--boxShadow, none);
    box-sizing: border-box;
    cursor: var(--cursor, default);
    display: flex;
    font-size: var(--fontSize, 1rem);
    align-items: center;
    line-height: var(--lineHeight, 2.5rem);
    padding: var(--padding, 0 0.5rem 0 1rem);
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
  }
  .svelte-selectbox:not(.disabled):not(.focused):hover {
    border: var(--borderHover, 1px solid #9ca3af); /* gray-400 */
    box-shadow: var(--boxShadowHover, none);
  }
  .svelte-selectbox.focused {
    border: var(--borderFocused, 1px solid #60a5fa); /* blue-400 */
    box-shadow: var(--boxShadowFocused, 0 0 4px 0 #60a5fa);
  }
  .svelte-selectbox.expanded {
    border: var(
      --borderExpanded,
      var(--borderFocused, 1px solid #60a5fa)
    ); /* blue-400 */
    border-radius: var(--borderRadiusExpanded, var(--borderRadius, 4px));
    box-shadow: var(
      --boxShadowExpanded,
      var(--boxShadowFocused, 0 0 4px 0 #60a5fa)
    );
  }
  .svelte-selectbox.expanded.drop-up {
    border-radius: var(
      --borderRadiusExpandedDropUp,
      var(--borderRadiusExpanded, 4px)
    );
    box-shadow: var(
      --boxShadowExpandedDropUp,
      var(--boxShadowFocused, 0 0 4px 0 #60a5fa)
    );
  }
  .svelte-selectbox input {
    border: 0;
    padding: 0;
    cursor: var(--cursor, default);
    width: 100%;
    font: inherit;
  }
  .svelte-selectbox input:focus {
    outline: none;
  }
  .svelte-selectbox.disabled {
    background-color: var(--disabledBackgroundColor, #e5e7eb); /* gray-200 */
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
    color: var(--placeholderColor, #d1d5db); /* gray-300 */
  }
  .svelte-selectbox-clear,
  .svelte-selectbox-arrow {
    cursor: pointer;
    display: flex;
  }
  .svelte-selectbox.disabled .svelte-selectbox-arrow {
    color: var(--disabledSelectArrowColor, #9ca3af);
  }
  .svelte-selectbox.disabled .svelte-selectbox-value {
    color: var(--disabledSelectValueColor, #9ca3af);
  }
</style>
