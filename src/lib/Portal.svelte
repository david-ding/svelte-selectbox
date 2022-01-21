<script lang="ts">
  export let appendTo: string = null;

  let container: HTMLElement = null;

  const append = (appendTo: string, container: HTMLElement) => {
    if (!container) return;

    const parentElement = appendTo
      ? document.querySelector(appendTo)
      : container.parentElement;
    const children = container.children;

    Array.from(children).forEach((child) => parentElement.appendChild(child));
  };

  $: append(appendTo, container);
</script>

<div bind:this={container} hidden>
  <slot />
</div>
