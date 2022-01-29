<script lang="ts">
  export let style: string | (() => string);

  $: computedStyle = typeof style === "function" ? style() : style;
</script>

{#if computedStyle}
  <div style={computedStyle}><slot /></div>
{:else}
  <slot />
{/if}
