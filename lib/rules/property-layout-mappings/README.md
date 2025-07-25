# property-layout-mappings

Require either physical or logical layout mappings in CSS.

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
/**   ↑
 * This physical property should be logical */
```

This rule helps enforce consistent use of CSS logical properties and values, which provide writing-mode relative equivalents of their corresponding physical properties. Logical properties are particularly useful for:

- Styling multilingual sites that support different writing modes
- Creating layouts that adapt to different text directions
- Providing a consistent flow-relative model

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"logical"` or `"physical"`

Given:

```json
{
  "property-layout-mappings": "logical"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
```

<!-- prettier-ignore -->
```css
a { margin-right: 5px; }
```

<!-- prettier-ignore -->
```css
a { padding-top: 8px; }
```

<!-- prettier-ignore -->
```css
a { border-bottom: 1px solid red; }
```

<!-- prettier-ignore -->
```css
a { left: 0; }
```

<!-- prettier-ignore -->
```css
a { width: 200px; }
```

<!-- prettier-ignore -->
```css
a { border-top-left-radius: 5px; }
```

<!-- prettier-ignore -->
```css
a { scroll-margin-left: 10px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 10px; }
```

<!-- prettier-ignore -->
```css
a { margin-block-end: 5px; }
```

<!-- prettier-ignore -->
```css
a { padding-inline-start: 8px; }
```

<!-- prettier-ignore -->
```css
a { border-block-end: 1px solid red; }
```

<!-- prettier-ignore -->
```css
a { inset-inline-start: 0; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 200px; }
```

<!-- prettier-ignore -->
```css
a { border-start-start-radius: 5px; }
```

<!-- prettier-ignore -->
```css
a { scroll-margin-inline-start: 10px; }
```

Given:

```json
{
  "property-layout-mappings": "physical"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 10px; }
```

<!-- prettier-ignore -->
```css
a { padding-block-start: 8px; }
```

<!-- prettier-ignore -->
```css
a { inset-inline-end: 0; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 200px; }
```

<!-- prettier-ignore -->
```css
a { border-start-start-radius: 5px; }
```

<!-- prettier-ignore -->
```css
a { scroll-margin-inline-start: 10px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
```

<!-- prettier-ignore -->
```css
a { padding-top: 8px; }
```

<!-- prettier-ignore -->
```css
a { right: 0; }
```

<!-- prettier-ignore -->
```css
a { width: 200px; }
```

## Optional secondary options

### `exceptProperties: Array<string | RegExp>`

Given:

```json
{
  "property-layout-mappings": [
    "logical",
    { "exceptProperties": ["margin-left", "width"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
```

<!-- prettier-ignore -->
```css
a { width: 200px; }
```

Given:

```json
{
  "property-layout-mappings": ["logical", { "exceptProperties": ["/^margin/"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
```

<!-- prettier-ignore -->
```css
a { margin-top: 8px; }
```
