<script lang="ts">
  export let appendTo: string | undefined;

  let container: HTMLElement | undefined;

  const append = (appendTo: string | undefined, container: HTMLElement | undefined) => {
    if (!container) return;

    const parentElement = appendTo ? document.querySelector(appendTo) : container.parentElement;

    if (!parentElement) return;

    const children = container.children;
    Array.from(children).forEach((child) => parentElement.appendChild(child));
  };

  $: append(appendTo, container);
</script>

<div bind:this={container} hidden>
  <slot />
</div>
