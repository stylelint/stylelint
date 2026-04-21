# value-keyword-layout-mappings

Specify flow-relative or physical layout mappings for value keywords.

<!-- prettier-ignore -->
```css
a { float: left; }
/**        ↑
 *         This keyword */
```

Physical keywords like `left`, `top` and `horizontal` are tied to the physical dimensions of the screen. Flow-relative keywords like `inline-start`, `block-start` and `inline` adapt to different writing modes and text directions, making them useful for internationalization. They are the keyword-level counterpart to flow-relative properties and units.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix problems reported by this rule when both the primary option is `"flow-relative"` and the [`languageOptions.directionality`](../../../docs/user-guide/configure.md#directionality) configuration property is configured.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the disallowed mapping and the keyword, or the physical keyword and its flow-relative equivalent.

Prior art:

- [stylelint-plugin-logical-css](https://www.npmjs.com/package/stylelint-plugin-logical-css)
- [stylelint-use-logical](https://www.npmjs.com/package/stylelint-use-logical)
- [stylelint-use-logical-spec](https://www.npmjs.com/package/stylelint-use-logical-spec)

## Options

### `"flow-relative"`

Layout mappings for value keywords _must always_ be flow-relative.

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
  "value-keyword-layout-mappings": "flow-relative"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { float: left; }
```

<!-- prettier-ignore -->
```css
a { text-align: right; }
```

<!-- prettier-ignore -->
```css
a { resize: horizontal; }
```

<!-- prettier-ignore -->
```css
a { caption-side: top; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { float: inline-start; }
```

<!-- prettier-ignore -->
```css
a { text-align: end; }
```

<!-- prettier-ignore -->
```css
a { resize: inline; }
```

<!-- prettier-ignore -->
```css
a { caption-side: block-start; }
```

### `"physical"`

Layout mappings for value keywords _must always_ be physical.

Given:

```json
{
  "value-keyword-layout-mappings": "physical"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { float: inline-start; }
```

<!-- prettier-ignore -->
```css
a { text-align: start; }
```

<!-- prettier-ignore -->
```css
a { resize: inline; }
```

<!-- prettier-ignore -->
```css
a { caption-side: block-start; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { float: left; }
```

<!-- prettier-ignore -->
```css
a { text-align: right; }
```

<!-- prettier-ignore -->
```css
a { resize: horizontal; }
```

<!-- prettier-ignore -->
```css
a { caption-side: top; }
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
  "value-keyword-layout-mappings": [
    "flow-relative",
    { "ignoreProperties": ["text-align", "/^caption-/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { text-align: left; }
```

<!-- prettier-ignore -->
```css
a { caption-side: top; }
```

### `ignoreKeywords`

Ignore the specified keywords.

```json
{ "ignoreKeywords": ["array", "of", "keywords", "/regex/"] }
```

Given:

```json
{
  "value-keyword-layout-mappings": [
    "flow-relative",
    { "ignoreKeywords": ["left", "/^hor/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { float: left; }
```

<!-- prettier-ignore -->
```css
a { resize: horizontal; }
```
