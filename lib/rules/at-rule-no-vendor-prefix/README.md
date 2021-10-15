# at-rule-no-vendor-prefix

Disallow vendor prefixes for at-rules.

<!-- prettier-ignore -->
```css
    @-webkit-keyframes { 0% { top: 0; } }
/**  ↑
 * This prefix */
```

This rule ignores non-standard vendor-prefixed at-rules that aren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer).

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

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
