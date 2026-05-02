# unit-layout-mappings

Specify flow-relative or physical layout mappings for units.

<!-- prettier-ignore -->
```css
a { width: 100vw; }
/**           ↑
 *            This unit */
```

Physical units like `vw` and `vh` are tied to the physical dimensions of the viewport. Flow-relative units like `vi` and `vb` adapt to different writing modes and text directions, making them useful for internationalization. They are the unit-level counterpart to flow-relative properties like `inline-size` and `block-size`.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix problems reported by this rule when both the primary option is `"flow-relative"` and the [`languageOptions.directionality`](../../../docs/user-guide/configure.md#directionality) configuration property is configured.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the disallowed mapping and the unit, or the physical unit and its flow-relative equivalent.

Prior art:

- [stylelint-plugin-logical-css](https://www.npmjs.com/package/stylelint-plugin-logical-css)
- [stylelint-use-logical](https://www.npmjs.com/package/stylelint-use-logical)
- [stylelint-use-logical-spec](https://www.npmjs.com/package/stylelint-use-logical-spec)

## Options

### `"flow-relative"`

Layout mappings for units _must always_ be flow-relative.

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
  "unit-layout-mappings": "flow-relative"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 10vw; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 50cqw; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 10vi; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 50cqi; }
```

### `"physical"`

Layout mappings for units _must always_ be physical.

Given:

```json
{
  "unit-layout-mappings": "physical"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin-top: 10vb; }
```

<!-- prettier-ignore -->
```css
a { width: 50cqi; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-top: 10vh; }
```

<!-- prettier-ignore -->
```css
a { width: 50cqw; }
```

## Optional secondary options

### `ignoreUnits`

Ignore the specified units.

```json
{ "ignoreUnits": ["array", "of", "units", "/regex/"] }
```

Given:

```json
{
  "unit-layout-mappings": ["flow-relative", { "ignoreUnits": ["vh", "/^cq/"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 10vh; }
```

<!-- prettier-ignore -->
```css
a { width: 50cqw; }
```
