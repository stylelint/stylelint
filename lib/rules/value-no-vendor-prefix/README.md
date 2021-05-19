# value-no-vendor-prefix

Disallow vendor prefixes for values.

<!-- prettier-ignore -->
```css
a { display: -webkit-flex; }
/**          ↑
 *  These prefixes */
```

This rule ignores non-standard vendor-prefixed values that aren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer).

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `true`

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a { display: -webkit-flex; }
```

<!-- prettier-ignore -->
```css
a { max-width: -moz-max-content; }
```

<!-- prettier-ignore -->
```css
a { background: -webkit-linear-gradient(bottom, #000, #fff); }
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
a { display: flex; }
```

<!-- prettier-ignore -->
```css
a { max-width: max-content; }
```

<!-- prettier-ignore -->
```css
a { background: linear-gradient(bottom, #000, #fff); }
```

## Optional secondary options

### `ignoreValues: ["string"]`

Given:

```json
["grab", "max-content"]
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
cursor: -webkit-grab;
```

<!-- prettier-ignore -->
```css
.foo { max-width: -moz-max-content; }
```
