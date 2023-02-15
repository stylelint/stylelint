# selector-no-vendor-prefix

Disallow vendor prefixes for selectors.

<!-- prettier-ignore -->
```css
input::-moz-placeholder {}
/**     ↑
 * This prefix */
```

This rule ignores non-standard vendor-prefixed selectors that aren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer).

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule. However, it will not remove duplicate selectors produced when the prefixes are removed. You can use [Autoprefixer](https://github.com/postcss/autoprefixer) itself, with the [`add` option off and the `remove` option on](https://github.com/postcss/autoprefixer#options), in these situations.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
input::-moz-placeholder {}
```

<!-- prettier-ignore -->
```css
:-webkit-full-screen a {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
input::placeholder {}
```

<!-- prettier-ignore -->
```css
:full-screen a {}
```

## Optional secondary options

### `ignoreSelectors: ["/regex/", /regex/, "non-regex"]`

Ignore vendor prefixes for selectors.

Given:

```json
["::-webkit-input-placeholder", "/-moz-.*/"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
input::-webkit-input-placeholder {
  color: pink;
}

input::-moz-placeholder {
  color: pink;
}
```
