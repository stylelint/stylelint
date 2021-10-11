# media-feature-name-no-vendor-prefix

Disallow vendor prefixes for media feature names.

<!-- prettier-ignore -->
```css
@media (-webkit-min-device-pixel-ratio: 1) {}
/**      ↑
 * This prefixe */
```

This rule ignores non-standard vendor-prefixed media feature names that aren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer).

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (-webkit-min-device-pixel-ratio: 1) {}
```

<!-- prettier-ignore -->
```css
@media (min--mox-device-pixel-ratio: 1) {}
```

<!-- prettier-ignore -->
```css
@media (-o-max-device-pixel-ratio: 1/1) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (min-resolution: 96dpi) {}
```

<!-- prettier-ignore -->
```css
@media (max-resolution: 900dpi) {}
```
