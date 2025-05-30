# property-no-unknown

Disallow unknown properties.

<!-- prettier-ignore -->
```css
a { height: 100%; }
/** ↑
 * This property */
```

This rule considers properties defined in the [CSS Specifications and browser specific properties](https://github.com/betit/known-css-properties#source) to be known.

This rule ignores:

- variables (`$sass`, `@less`, `--custom-property`)
- vendor-prefixed properties (e.g., `-moz-align-self`, `-webkit-align-self`)

Use option `checkPrefixed` described below to turn on checking of vendor-prefixed properties.

For customizing syntax, see the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) section.

## Options

### `true`

```json
{
  "property-no-unknown": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  colr: blue;
}
```

<!-- prettier-ignore -->
```css
a {
  my-property: 1;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: green;
}
```

<!-- prettier-ignore -->
```css
a {
  fill: black;
}
```

<!-- prettier-ignore -->
```css
a {
  -moz-align-self: center;
}
```

<!-- prettier-ignore -->
```css
a {
  -webkit-align-self: center;
}
```

<!-- prettier-ignore -->
```css
a {
  align-self: center;
}
```

## Optional secondary options

### `ignoreProperties`

```json
{ "ignoreProperties": ["array", "of", "properties", "/regex/"] }
```

Given:

```json
{
  "property-no-unknown": [true, { "ignoreProperties": ["/^my-/", "custom"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  my-property: 10px;
}
```

<!-- prettier-ignore -->
```css
a {
  my-other-property: 10px;
}
```

<!-- prettier-ignore -->
```css
a {
  custom: 10px;
}
```

### `ignoreSelectors`

```json
{ "ignoreSelectors": ["array", "of", "selectors", "/regex/"] }
```

Skips checking properties of the given selectors against this rule.

Given:

```json
{
  "property-no-unknown": [true, { "ignoreSelectors": [":root"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:root {
  my-property: blue;
}
```

### `ignoreAtRules`

```json
{ "ignoreAtRules": ["array", "of", "at-rules", "/regex/"] }
```

Ignores properties nested within specified at-rules.

Given:

```json
{
  "property-no-unknown": [true, { "ignoreAtRules": ["supports"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@supports (display: grid) {
  a {
    my-property: 1;
  }
}
```

### `checkPrefixed`

If `true`, this rule will check vendor-prefixed properties. Defaults to `false`.

Given:

```json
{
  "property-no-unknown": [true, { "checkPrefixed": true }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  -webkit-overflow-scrolling: auto;
}
```

<!-- prettier-ignore -->
```css
a {
  -moz-box-flex: 0;
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  -moz-align-self: center;
}
```

<!-- prettier-ignore -->
```css
a {
  -moz-overflow-scrolling: center;
}
```
