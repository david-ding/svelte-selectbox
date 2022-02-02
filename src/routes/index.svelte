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
    yOffset="-2px"
    --border="2px solid #d8d8d8"
    --border-hover="2px solid #d8d8d8"
    --border-radius="8px"
    --border-radius-expanded="8px 8px 0 0"
    --border-radius-expanded-up="0 0 8px 8px"
    --box-shadow-focused="none"
    --box-shadow-expanded="none"
    --box-shadow-expanded-up="none"
    --border-focused="2px solid #60a5fa"
    --border-expanded="2px solid #60a5fa"
    --color="#6B7280"
    --line-height="2.5rem"
    --dropdown-border-width="0 2px 2px 2px"
    --dropdown-border-color="#60a5fa"
    --dropdown-border-radius="0 0 8px 8px"
    --dropdown-border-width-up="2px 2px 0 2px"
    --dropdown-border-radius-up="8px 8px 0 0"
    --dropdown-item-color="#6B7280"
    --dropdown-item-color-hover="#6B7280"
    --dropdown-box-shadow="none"
    --dropdown-item-border="1px solid #fafafa"
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
