# at-rule-no-vendor-prefix

Disallow vendor prefixes for at-rules.

<!-- prettier-ignore -->
```css
    @-webkit-keyframes { 0% { top: 0; } }
/**   ↑
 * This prefix */
```

This rule ignores non-standard vendor-prefixed at-rules that aren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer).

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule. However, it will not remove duplicate at-rules produced when the prefixes are removed. You can use [Autoprefixer](https://github.com/postcss/autoprefixer) itself, with the [`add` option off and the `remove` option on](https://github.com/postcss/autoprefixer#options), in these situations.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@-webkit-keyframes { 0% { top: 0; } }
```

<!-- prettier-ignore -->
```css
@-ms-viewport { orientation: landscape; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@keyframes { 0% { top: 0; } }
```

<!-- prettier-ignore -->
```css
@viewport { orientation: landscape; }
```
