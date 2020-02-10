# media-feature-name-no-vendor-prefix

Disallow vendor prefixes for media feature names.

<!-- prettier-ignore -->
```css
@media (-webkit-min-device-pixel-ratio: 1) {}
/**      ↑
 * This prefixe */
```

Right now this rule simply checks for prefixed _resolutions_.

## Options

### `true`

The following patterns are considered violations:

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

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
@media (min-resolution: 96dpi) {}
```

<!-- prettier-ignore -->
```css
@media (max-resolution: 900dpi) {}
```
