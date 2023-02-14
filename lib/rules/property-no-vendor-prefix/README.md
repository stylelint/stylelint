# property-no-vendor-prefix

Disallow vendor prefixes for properties.

<!-- prettier-ignore -->
```css
a { -webkit-transform: scale(1); }
/**  ↑
 * This prefix */
```

This rule ignores non-standard vendor-prefixed properties that aren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer).

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule. However, it will not remove duplicate properties produced when the prefixes are removed. You can use [Autoprefixer](https://github.com/postcss/autoprefixer) itself, with the [`add` option off and the `remove` option on](https://github.com/postcss/autoprefixer#options), in these situations.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { -webkit-transform: scale(1); }
```

<!-- prettier-ignore -->
```css
a { -moz-columns: 2; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
```

<!-- prettier-ignore -->
```css
a { columns: 2; }
```

<!-- prettier-ignore -->
```css
a { -webkit-touch-callout: none; }
```

## Optional secondary options

### `ignoreProperties: ["/regex/", /regex/, "string"]`

Given:

```json
["transform", "columns"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { -webkit-transform: scale(1); }
```

<!-- prettier-ignore -->
```css
a { -moz-columns: 2; }
```
