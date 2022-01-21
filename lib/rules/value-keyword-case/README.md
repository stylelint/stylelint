### `camelCaseSvgKeywords: true | false` (default: `false`)

If `true`, this rule expects SVG keywords to be camel case when the primary option is `"lower"`.

For example with `true`:

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a {
  color: currentColor;
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
a {
  color: currentcolor;
}
```
