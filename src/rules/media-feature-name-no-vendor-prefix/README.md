# media-feature-name-no-vendor-prefix

Disallow vendor prefixes for media feature names.

```css
@media (-webkit-min-device-pixel-ratio: 1) {}
/**      ↑
 * These prefixes */
```

Right now this rule simply checks for prefixed *resolutions*.

## Options

### `true`

The following patterns are considered warnings:

```css
@media (-webkit-min-device-pixel-ratio: 1) {}
```

```css
@media (min--mox-device-pixel-ratio: 1) {}
```

```css
@media (-o-max-device-pixel-ratio: 1/1) {}
```

The following patterns are *not* considered warnings:

```css
@media (min-resolution: 96dpi) {}
```

```css
@media (max-resolution: 900dpi) {}
```
