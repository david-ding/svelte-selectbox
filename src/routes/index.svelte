<script lang="ts">
  import { Select, SelectOption } from "$lib";

  const options: Array<SelectOption> = [
    { value: "Mercury", label: "Mercury" },
    { value: "Venus", label: "Venus" },
    { value: "Earth", label: "Earth" },
    { value: "Mars", label: "Mars" },
    { value: "Jupiter", label: "Jupiter" },
    { value: "Saturn", label: "Saturn" },
    { value: "Uranus", label: "Uranus" },
    { value: "Neptune", label: "Neptune" },
  ];

  let value: string = "Earth";
</script>

<h1>Svelte Selectbox</h1>

<div>
  <h2>Default select</h2>
  <Select {options} />
</div>

<div>
  <h2>Searchable select</h2>
  <Select placeholder="Select..." searchable {options} />
</div>

<div>
  <h2>Disabled select</h2>
  <Select disabled {options} placeholder="Select..." {value} />
</div>

<div>
  <h2>Dropdown Menu Direction</h2>
  <h3>Upwards</h3>
  <Select {options} placeholder="Select..." direction="up" />
  <h3>Downwards</h3>
  <Select {options} placeholder="Select..." direction="down" />
</div>

<div>
  <h2>Custom Dropdown Container</h2>
  <Select {options} placeholder="Select..." appendTo="body" />
</div>

<div>
  <h2>Custom Theming</h2>
  <Select
    {options}
    placeholder="Select..."
    yOffset="-1px"
    --border-radius="4px"
    --border-radius-expanded="4px 4px 0 0"
    --border-radius-expanded-up="0 0 4px 4px"
    --box-shadow-focused="none"
    --box-shadow-expanded="none"
    --box-shadow-expanded-up="none"
    --border-focused="1px solid #60a5fa"
    --border-expanded="1px solid #60a5fa"
    --line-height="2rem"
    --dropdown-border-width="0 1px 1px 1px"
    --dropdown-border-color="#60a5fa"
    --dropdown-border-radius="0 0 4px 4px"
    --dropdown-border-width-up="1px 1px 0 1px"
    --dropdown-border-radius-up="4px 4px 0 0"
    --dropdown-item-color-highlighted="inherit"
    --dropdown-box-shadow="none"
    --dropdown-item-border-top="1px solid #fafafa"
  />
</div>

<div>
  <h2>Custom Icons</h2>
  <Select {options}>
    <div slot="clear-icon" style="margin-right: 0.5rem">❌</div>
    <div slot="chevron-icon" let:expanded>
      {expanded ? "🔺" : "🔻"}
    </div>
  </Select>
</div>
