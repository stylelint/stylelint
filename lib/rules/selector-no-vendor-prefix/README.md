# selector-no-vendor-prefix

Disallow vendor prefixes for selectors.

<!-- prettier-ignore -->
```css
input::-moz-placeholder {}
/**     ↑
 * This prefix */
```

This rule ignores non-standard vendor-prefixed selectors that aren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer).

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `true`

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
input::-moz-placeholder {}
```

<!-- prettier-ignore -->
```css
:-webkit-full-screen a {}
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
input::placeholder {}
```

<!-- prettier-ignore -->
```css
:full-screen a {}
```

## Optional secondary options

### `ignoreSelectors: ["/regex/", "non-regex"]`

Ignore vendor prefixes for selectors.

Given:

```json
["::-webkit-input-placeholder", "/-moz-.*/"]
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
input::-webkit-input-placeholder {
  color: pink;
}

input::-moz-placeholder {
  color: pink;
}
```
