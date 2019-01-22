# media-feature-name-no-vendor-prefix

Disallow vendor prefixes for media feature names.

```css
@media (-webkit-min-device-pixel-ratio: 1) {}
/**      ↑
 * These prefixes */
```

Right now this rule simply checks for prefixed *resolutions*.

## 选项

### `true`

以下模式被视为违规：

```css
@media (-webkit-min-device-pixel-ratio: 1) {}
```

```css
@media (min--mox-device-pixel-ratio: 1) {}
```

```css
@media (-o-max-device-pixel-ratio: 1/1) {}
```

以下模式*不*被视为违规：

```css
@media (min-resolution: 96dpi) {}
```

```css
@media (max-resolution: 900dpi) {}
```
