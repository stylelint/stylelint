# media-feature-name-no-vendor-prefix

Disallow vendor prefixes for media feature names.

<!-- prettier-ignore -->
```css
@media (-webkit-min-device-pixel-ratio: 1) {}
/**      ↑
 * This prefix */
```

This rule ignores non-standard vendor-prefixed media feature names that aren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer).

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule. However, it will not remove duplicate media feature names produced when the prefixes are removed. You can use [Autoprefixer](https://github.com/postcss/autoprefixer) itself, with the [`add` option off and the `remove` option on](https://github.com/postcss/autoprefixer#options), in these situations.

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
