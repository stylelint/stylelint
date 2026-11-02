# property-layout-mappings

Specify flow-relative or physical layout mappings for properties.

<!-- prettier-ignore -->
```css
a { margin-left: 0; }
/** ↑
 * This property */
```

Use this rule to enforce a convention. Physical properties like `margin-left` are tied to the screen, while flow-relative properties like `margin-inline-start` follow the writing mode.

Choose:

- `"flow-relative"` to support right-to-left and vertical [writing modes](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values)
- `"physical"` if you support only one writing mode, or for older browsers

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix problems reported by this rule when both the primary option is `"flow-relative"` and the [`languageOptions.directionality`](../../../docs/user-guide/configure.md#directionality) configuration property is configured.

This rule supports up to 3 [message arguments](../../../docs/user-guide/configure.md#message): the disallowed mapping and the property, or the physical property and its flow-relative equivalents.

Prior art:

- [stylelint-plugin-logical-css](https://www.npmjs.com/package/stylelint-plugin-logical-css)
- [stylelint-use-logical](https://www.npmjs.com/package/stylelint-use-logical)
- [stylelint-use-logical-spec](https://www.npmjs.com/package/stylelint-use-logical-spec)

## Options

### `"flow-relative"`

Layout mappings for properties _must always_ be flow-relative.

> [!NOTE]
> If you want this rule to automatically fix problems, you must configure the [`languageOptions.directionality`](../../../docs/user-guide/configure.md#directionality) configuration property.
>
> For example, for Latin-based languages such as English:
>
> ```json
> {
>   "languageOptions": {
>     "directionality": {
>       "block": "top-to-bottom",
>       "inline": "left-to-right"
>     }
>   }
> }
> ```

Given:

```json
{
  "property-layout-mappings": "flow-relative"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 0; }
```

<!-- prettier-ignore -->
```css
a { width: 0; }
```

<!-- prettier-ignore -->
```css
a { margin: 0 1px; }
```

<!-- prettier-ignore -->
```css
a { transition: margin-left 0 ease; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 0; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 0; }
```

<!-- prettier-ignore -->
```css
a { margin: 0; }
```

<!-- prettier-ignore -->
```css
a { transition: margin-inline-start 0 ease; }
```

### `"physical"`

Layout mappings for properties _must always_ be physical.

Given:

```json
{
  "property-layout-mappings": "physical"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 0; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 0; }
```

<!-- prettier-ignore -->
```css
a { transition: margin-inline-start 0 ease; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 0; }
```

<!-- prettier-ignore -->
```css
a { width: 0; }
```

<!-- prettier-ignore -->
```css
a { transition: margin-left 0 ease; }
```

## Optional secondary options

### `ignoreProperties`

Ignore the specified properties.

```json
{ "ignoreProperties": ["array", "of", "properties", "/regex/"] }
```

Given:

```json
{
  "property-layout-mappings": [
    "flow-relative",
    { "ignoreProperties": ["/^margin/", "width"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 0; }
```

<!-- prettier-ignore -->
```css
a { width: 0; }
```

<!-- prettier-ignore -->
```css
a { transition: margin-left 0 ease; }
```
