# Svelte Selectbox
A simple selectbox library with custom dropdown placements. [Demos](https://svelte-selectbox.onrender.com/)

# Installation
npm
```
npm i --save svelte-selectbox
```
yarn
```
yarn add svelte-selectbox
```

# Usage
```javascript
<script>
  import Select from "svelte-selectbox";

  const options = [
    { value: "Mercury", label: "Mercury" },
    { value: "Venus", label: "Venus" },
    { value: "Earth", label: "Earth" },
    { value: "Mars", label: "Mars" },
    { value: "Jupiter", label: "Jupiter" },
    { value: "Saturn", label: "Saturn" },
    { value: "Uranus", label: "Uranus" },
    { value: "Neptune", label: "Neptune" },
  ];

  let value = "Earth"

  function onSelect(option) {
    console.log(option.data.value);
  }
</script>

<Select {options} bind:value on:select={onSelect} />
<p>{ value } is selected</p>
```

# Props
| Prop               | Default                    | Description                                                                                                                                                                                                                                                         |
|--------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `appendTo`         | `null`                     | Specify the CSS selector of the container element to attach the dropdown element.                                                                                                                                                                                   |
| `direction`        | "auto"                     | Specify which direction should the dropdown open. Valid values are "auto", "up" or "down". If "auto" is selected, then it will determine the direction based on the viewport.                                                                                       |
| `disabled`         | `false`                    | Specify if the dropdown is disabled.                                                                                                                                                                                                                                |
| `dropdownHeight`   | `null`                     | Specify the height of the dropdown element. An alternative way to specify the dropdown height is to use `itemHeight` + `maxItems`. If `dropdownHeight` is specified, then `itemHeight` and `maxItems` values are ignored. "px", "rem" and "em" values are accepted. |
| `htmlId`           | `null`                     | Specify the id of the underlying `input` element.                                                                                                                                                                                                                   |
| `itemHeight`       | "3rem"                     | Specify the height of each dropdown item. This prop in conjunction with `maxItems` determines the dropdown height. You may also set the dropdown height directly using the `dropdownHeight` prop. "px", "rem" and "em" values are accepted.                         |
| `maxItems`         | `5`                        | Specify the maximum number of dropdown items.                                                                                                                                                                                                                       |
| `optionKeyFn`      | `(option) => option.label` | Function to return a unique identifier of a dropdown item (for optimization purpose).                                                                                                                                                                               |
| `options`          | `[]`                       | Specify the available options. e.g. `[{ label: 'Item 1', value: 1 }, { label: 'Item 2', value: 2, disabled: true }]`                                                                                                                                                |
| `placeholder`      | `null`                     | Specify the placeholder text when no option is selected.                                                                                                                                                                                                            |
| `searchFn`         | `null`                     | Override the default search function.                                                                                                                                                                                                                               |
| `searchable`       | `false`                    | Specify if the dropdown is searchable.                                                                                                                                                                                                                              |
| `showChevron`      | `true`                     | Specify if the chevron is shown.                                                                                                                                                                                                                                    |
| `showEmptyResults` | `true`                     | Specify if a placeholder is shown if there are no options available.                                                                                                                                                                                                |
| `value`            | `null`                     | Specify the current value.                                                                                                                                                                                                                                          |
| `valueFormatterFn` | `null`                     | Function to return the string value shown in the selector if an option is selected. By default this is the option `label`.                                                                                                                                          |
| `yOffset`          | `1rem`                     | Specify the vertical offset between the dropdown and selector elements. "px", "rem" and "em" values are accepted.                                                                                                                                                   |

# Slots
## Item
Specify the item template.

`option` - option object of current item

Example:
```html
<div slot="item" let:option>{ `${option.label} (${option.value})` }</div>
```
## Clear Icon
Specify the clear icon template.

Example:
```html
<div slot="clear-icon" style="margin-right: 0.5rem">❌</div>
```
## Chevron Icon
Specify the chevron icon template.

`expanded` - whether the dropdown is expanded

Example:
```html
<div slot="chevron-icon" let:expanded>
  {expanded ? "🔺" : "🔻"}
</div>
```
## No Option Placeholder
Specify the no option placeholder template.

Example:
```html
<div slot="no-option-placeholder">Nothing to see here...</div>
```
## Value
Specify the selector value template.

`formattedValue` - the formatted value with `valueFormatterFn` applied, by default this is the option label

Example:
```html
<div slot="value" let:formattedValue>
  <MyFancyComponent>{formattedValue}</MyFancyComponent>
</div>
```

# Theming
You can style the selectbox with CSS variables.

Example:
```javascript
<script>
  import Select from "svelte-selectbox";

  const options = [
    { value: "Mercury", label: "Mercury" },
    { value: "Venus", label: "Venus" },
    { value: "Earth", label: "Earth" },
    { value: "Mars", label: "Mars" },
    { value: "Jupiter", label: "Jupiter" },
    { value: "Saturn", label: "Saturn" },
    { value: "Uranus", label: "Uranus" },
    { value: "Neptune", label: "Neptune" },
  ];
</script>

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
```

A list of exposed CSS variables are:

- --background-color
- --border
- --border-expanded
- --border-focused
- --border-hover
- --border-radius
- --border-radius-expanded
- --border-radius-expanded-up
- --box-shadow
- --box-shadow-expanded
- --box-shadow-focused
- --box-shadow-hover
- --color
- --cursor
- --disabled-background-color
- --disabled-select-arrow-color
- --disabled-select-value-color
- --dropdown-background-color
- --dropdown-border-color
- --dropdown-border-radius
- --dropdown-border-radius-up
- --dropdown-border-width
- --dropdown-border-width-up
- --dropdown-box-shadow
- --dropdown-font-size
- --dropdown-item-background-highlighted
- --dropdown-item-border
- --dropdown-item-color
- --dropdown-item-color-highlighted
- --dropdown-item-disabled-color
- --dropdown-z-index
- --font-size
- --line-height
- --padding
- --placeholder-color
