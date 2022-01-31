<script lang="ts">
  export let direction: "up" | "down" = "down";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class:up={ direction === "up" }
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
</svg>

<style>
  svg {
    height: var(--chevron-height, 1rem);
    width: var(--chevron-width, 1rem);
    margin: var(--chevron-margin, 0 0.25rem);
  }
  .up {
    transform: rotate(180deg);
  }
</style>
