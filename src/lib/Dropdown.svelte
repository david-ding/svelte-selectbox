<script lang="ts" context="module">
  export const DROPDOWN_CSS_CUSTOM_PROPERTIES = [
    "--border-radius",
    "--dropdown-background-color",
    "--dropdown-border-color",
    "--dropdown-border-radius",
    "--dropdown-border-radius-up",
    "--dropdown-border-width",
    "--dropdown-border-width-up",
    "--dropdown-box-shadow",
    "--dropdown-font-size",
    "--dropdown-item-background-highlighted",
    "--dropdown-item-background-hover",
    "--dropdown-item-border",
    "--dropdown-item-color",
    "--dropdown-item-color-highlighted",
    "--dropdown-item-color-hover",
    "--dropdown-item-disabled-color",
    "--dropdown-z-index",
    "--font-size",
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
  export let dropdownHeightPx: number; // takes precedence over maxItems+itemHeightPx
  export let itemHeightPx: number;
  export let maxItems: number;
  export let optionKeyFn: (option: SelectOption) => unknown;
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
      height =
        dropdownHeightPx ||
        contentBoxHeightToBorderBoxHeight(
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
    {#each options as option, i (optionKeyFn(option))}
      {#if option.disabled}
        <div class="svelte-selectbox-dropdown-item disabled" style={itemStyle}>
          <slot name="item" {option}>{option.label}</slot>
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
          <slot name="item" {option}>{option.label}</slot>
        </div>
      {/if}
    {:else}
      <div class="svelte-selectbox-dropdown-item disabled" style={itemStyle}>
        <slot name="no-option-placeholder">No options found</slot>
      </div>
    {/each}
  </div>
</div>

<style>
  .svelte-selectbox-dropdown {
    position: absolute;
    border-color: var(--dropdown-border-color, #d1d5db); /* blue-400 */
    border-style: solid;
    border-width: var(--dropdown-border-width, 1px);
    border-radius: var(--dropdown-border-radius, var(--border-radius, 4px));
    overflow: hidden;
    z-index: var(--dropdown-z-index, 2);
    background-color: var(--dropdown-background-color, #ffffff);
    box-shadow: var(--dropdown-box-shadow, 0 2px 3px 0 #d1d5db);
    box-sizing: border-box;
  }
  .svelte-selectbox-dropdown * {
    box-sizing: border-box;
  }
  .svelte-selectbox-dropdown.drop-up {
    border-width: var(
      --dropdown-border-width-up,
      var(--dropdown-border-width, 1px)
    );
    border-radius: var(
      --dropdown-border-radius-up,
      var(--dropdown-border-radius, 4px)
    );
  }
  .svelte-selectbox-dropdown-item {
    padding: 0 0.5rem 0 1rem;
    display: flex;
    font-size: var(--dropdown-font-size, var(--font-size, 1rem));
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--dropdown-item-color, #1F2937); /* gray-800 */
    border-top: var(--dropdown-item-border, 0);
  }
  .drop-up .svelte-selectbox-dropdown-item {
    border-top: 0;
    border-bottom: var(--dropdown-item-border, 0);
  }
  .svelte-selectbox-dropdown-item.disabled {
    color: var(--dropdown-item-disabled-color, #d1d5db); /* gray-300 */
    cursor: default;
  }
  .svelte-selectbox-dropdown-item.highlighted,
  .svelte-selectbox-dropdown-item.highlighted:hover {
    color: var(--dropdown-item-color-highlighted, white);
    background-color: var(
      --dropdown-item-background-highlighted,
      #1d4ed8
    ); /* blue-700 */
  }
  .svelte-selectbox-dropdown-item:not(.disabled):not(.highlighted):hover {
    color: var(--dropdown-item-color-hover, currentColor);
    background-color: var(
      --dropdown-item-background-hover,
      #dbeafe
    ); /* blue-100 */
  }
  .svelte-selectbox-scroll-area {
    overflow-y: auto;
  }
</style>
