<script>
  import "../app.css";
</script>

<svelte:head>
  {#if import.meta.env.VITE_ENV === "production"}
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-97SDH6TKGR"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "G-97SDH6TKGR");
    </script>
  {/if}
</svelte:head>

<main>
  <slot />
</main>
