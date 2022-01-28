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
    --borderRadius="4px"
    --borderRadiusExpanded="4px 4px 0 0"
    --borderRadiusExpandedDropUp="0 0 4px 4px"
    --boxShadowFocused="none"
    --boxShadowExpanded="none"
    --boxShadowExpandedDropUp="none"
    --borderFocused="1px solid #60a5fa"
    --borderExpanded="1px solid #60a5fa"
    --lineHeight="2rem"
    --dropdownBorderWidth="0 1px 1px 1px"
    --dropdownBorderColor="#60a5fa"
    --dropdownBorderRadius="0 0 4px 4px"
    --dropdownBorderWidthDropUp="1px 1px 0 1px"
    --dropdownBorderRadiusDropUp="4px 4px 0 0"
    --dropdownItemColorHighlighted="inherit"
    --dropdownBoxShadow="none"
    --dropdownItemBorderTop="1px solid #fafafa"
  />
</div>

<div>
  <h2>Custom Icons</h2>
  <Select {options}>
    <div slot="clearIcon" style="margin-right: 0.5rem">❌</div>
    <div slot="chevronIcon" let:expanded>
      {expanded ? "🔺" : "🔻"}
    </div>
  </Select>
</div>
