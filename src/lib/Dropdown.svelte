<script lang="ts" context="module">
  export const DROPDOWN_CSS_CUSTOM_PROPERTIES = [
    "--borderRadius",
    "--dropdownBackgroundColor",
    "--dropdownBorderColor",
    "--dropdownBorderRadius",
    "--dropdownBorderRadiusDropUp",
    "--dropdownBorderWidth",
    "--dropdownBorderWidthDropUp",
    "--dropdownBoxShadow",
    "--dropdownFontSize",
    "--dropdownItemBackgroundColorHighlighted",
    "--dropdownItemBackgroundColorHover",
    "--dropdownItemBorderTop",
    "--dropdownItemColorHighlighted",
    "--dropdownItemColorHover",
    "--dropdownItemDisabledColor",
    "--dropdownZIndex",
    "--fontSize",
  ];
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, tick } from "svelte";
  import {
    contentBoxHeightToBorderBoxHeight,
    scrollToItem,
  } from "./_utils/dom-utils";

  import type { Position, SelectOption } from "./types";

  export let dropUp: boolean = false;
  export let itemHeightPx: number;
  export let maxItems: number;
  export let options: Array<SelectOption>;
  export let position: Position;
  export let selectorElement: HTMLElement;
  export let selectedValue: unknown = null;
  export let width: number;

  let dropdownElement: HTMLElement = null;
  let dropdownScrollArea: HTMLElement = null;
  let dropdownStyle: string = "";
  let dropdownScrollAreaStyle: string = "";
  let height: number = 0;
  let highlightedIndex: number = 0;
  $: {
    if (dropdownScrollArea) {
      height = contentBoxHeightToBorderBoxHeight(
        dropdownScrollArea,
        maxItems * itemHeightPx,
      );
    }
  }

  $: {
    const { left, top, bottom } = position;
    const yOffset = dropUp ? `bottom: ${bottom}px` : `top: ${top}px`;
    dropdownStyle = `${yOffset}; left: ${left}px; width: ${width}px`;
    dropdownScrollAreaStyle = `max-height: ${height}px`;
  }
  $: itemStyle = `height: ${itemHeightPx}px`;
  $: {
    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue,
    );
    highlightedIndex =
      selectedIndex === -1 ? _findNextEnabledOptionIndex(-1) : selectedIndex;
  }

  const dispatch = createEventDispatcher();

  const selectOption = (option: SelectOption) => dispatch("select", option);
  const handleOptionClick = (option: SelectOption) => selectOption(option);

  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp": {
        highlightPrevious();
        event.preventDefault();
        break;
      }
      case "ArrowDown": {
        highlightNext();
        event.preventDefault();
        break;
      }
      case "Enter": {
        selectHightlightedOption();
        event.preventDefault();
        break;
      }
    }
  };

  const highlightPrevious = () => {
    highlightedIndex = _findNextEnabledOptionIndex(highlightedIndex, true);

    scrollToItem(
      dropdownScrollArea.children[highlightedIndex] as HTMLElement,
      dropdownScrollArea,
    );
  };

  const highlightNext = () => {
    highlightedIndex = _findNextEnabledOptionIndex(highlightedIndex);

    scrollToItem(
      dropdownScrollArea.children[highlightedIndex] as HTMLElement,
      dropdownScrollArea,
      false,
    );
  };

  const selectHightlightedOption = () =>
    selectOption(options[highlightedIndex]);

  const _findNextEnabledOptionIndex = (
    index: number,
    previous: boolean = false,
  ): number => {
    const enabledIndices = options
      .map((option, idx) => ({ option, idx }))
      .filter(({ option }) => !option.disabled)
      .map(({ idx }) => idx);

    const pos = enabledIndices.indexOf(index);
    if (pos === -1) {
      if (previous) {
        return (
          [...enabledIndices].reverse().find((i) => i < index) ||
          enabledIndices[enabledIndices.length - 1]
        );
      }
      return enabledIndices.find((i) => i > index) || enabledIndices[0];
    }

    if (previous) {
      return pos === 0
        ? enabledIndices[enabledIndices.length - 1]
        : enabledIndices[pos - 1];
    }

    return pos === enabledIndices.length - 1
      ? enabledIndices[0]
      : enabledIndices[pos + 1];
  };

  const checkAndHandleOutsideClick = (event: MouseEvent) => {
    const eventTarget = event.target as HTMLElement;
    if (
      selectorElement.contains(eventTarget) ||
      dropdownElement.contains(eventTarget)
    ) {
      return;
    }
    dispatch("outsideClick");
  };

  onMount(async () => {
    await tick();
    scrollToItem(
      dropdownScrollArea.children[highlightedIndex] as HTMLElement,
      dropdownScrollArea,
    );
  });
</script>

<svelte:window
  on:mousedown={checkAndHandleOutsideClick}
  on:keydown={handleKeydown}
/>

<div
  bind:this={dropdownElement}
  class="svelte-selectbox-dropdown"
  class:drop-up={dropUp}
  role="listbox"
  style={dropdownStyle}
>
  <div
    bind:this={dropdownScrollArea}
    class="svelte-selectbox-scroll-area"
    style={dropdownScrollAreaStyle}
  >
    {#each options as option, i (option.label)}
      {#if option.disabled}
        <div class="svelte-selectbox-dropdown-item disabled" style={itemStyle}>
          <slot name="item-disabled">{option.label}</slot>
        </div>
      {:else}
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div
          class="svelte-selectbox-dropdown-item"
          class:highlighted={highlightedIndex === i}
          on:click|stopPropagation={() => handleOptionClick(option)}
          role="option"
          style={itemStyle}
        >
          <slot name="item">{option.label}</slot>
        </div>
      {/if}
    {:else}
      <slot name="no-option-placeholder">
        <div class="svelte-selectbox-dropdown-item disabled" style={itemStyle}>
          No options found
        </div>
      </slot>
    {/each}
  </div>
</div>

<style>
  .svelte-selectbox-dropdown {
    position: absolute;
    border-color: var(--dropdownBorderColor, #d1d5db); /* blue-400 */
    border-style: solid;
    border-width: var(--dropdownBorderWidth, 1px);
    border-radius: var(--dropdownBorderRadius, var(--borderRadius, 4px));
    overflow: hidden;
    z-index: var(--dropdownZIndex, 2);
    background-color: var(--dropdownBackgroundColor, #ffffff);
    box-shadow: var(--dropdownBoxShadow, 0 2px 3px 0 #d1d5db);
    box-sizing: border-box;
    /* box-shadow: 0 2px 3px 0 rgb(34 36 38 / 15%); */
  }
  .svelte-selectbox-dropdown * {
    box-sizing: border-box;
  }
  .svelte-selectbox-dropdown.drop-up {
    border-width: var(
      --dropdownBorderWidthDropUp,
      var(--dropdownBorderWidth, 1px)
    );
    border-radius: var(
      --dropdownBorderRadiusDropUp,
      var(--dropdownBorderRadius, 4px)
    );
  }
  .svelte-selectbox-dropdown-item {
    padding: 0 0.5rem 0 1rem;
    display: flex;
    font-size: var(--dropdownFontSize, var(--fontSize, 1rem));
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-top: var(--dropdownItemBorderTop, 0);
  }
  .svelte-selectbox-dropdown-item.disabled {
    color: var(--dropdownItemDisabledColor, #d1d5db); /* gray-300 */
    cursor: default;
  }
  .svelte-selectbox-dropdown-item.highlighted,
  .svelte-selectbox-dropdown-item.highlighted:hover {
    color: var(--dropdownItemColorHighlighted, white);
    background-color: var(
      --dropdownItemBackgroundColorHighlighted,
      #1d4ed8
    ); /* blue-700 */
  }
  .svelte-selectbox-dropdown-item:not(.disabled):not(.highlighted):hover {
    color: var(--dropdownItemColorHover, currentColor);
    background-color: var(
      --dropdownItemBackgroundColorHover,
      #dbeafe
    ); /* blue-100 */
  }
  .svelte-selectbox-scroll-area {
    overflow-y: auto;
  }
</style>
