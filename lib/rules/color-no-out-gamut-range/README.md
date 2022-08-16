# color-no-out-gamut-range

Disallow out of gamut range colors.

<!-- prettier-ignore -->
```css
a { color: lch(48% 82 283) }
/**        ↑
 * This color is out of sRGB gamut range */
```

Colors declared using lch, oklch, lab and oklab functions can move from sRGB to P3 color space, which is not supported by most of screens right now. It can happen by mistake. For instance, by converting colors from one space to another.

This rule checks if the color is in sRGB space. If it's not, you should wrap it in media query like this:

```css
@media (color-gamut: p3) {
  a {
    color: lch(48% 82 283);
  }
}
```

Please note that conditional imports are not checked, e.g.:

```html
<link href="p3-custom-props.css" rel="stylesheet" media="(color-gamut: p3)" />
```

```css
@import url("p3-custom-props.css") (color-gamut: p3);
```

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: lch(48% 82 283) }
```

<!-- prettier-ignore -->
```css
a { color: oklch(48% 82 283) }
```

<!-- prettier-ignore -->
```css
a { color: lab(48% 82 283) }
```

<!-- prettier-ignore -->
```css
a { color: oklab(48% 82 283) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (color-gamut: p3) {
  a { color: lch(48% 82 283) }
}
```

<!-- prettier-ignore -->
```css
@media (color-gamut: p3) {
  a { color: oklch(48% 82 283) }
}
```

<!-- prettier-ignore -->
```css
@media (color-gamut: p3) {
  a { color: lab(48% 82 283) }
}
```

<!-- prettier-ignore -->
```css
@media (color-gamut: p3) {
  a { color: oklab(48% 82 283) }
}
```
