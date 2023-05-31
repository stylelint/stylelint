# number-no-partial-percent

Disallow percent size values that are not `0%` or `100%`.

> Usage of any percent values in colors, color-related functions, and shape functions is still allowed. (e.g. `rgba(0 0 0 / 60%)`, `opacity(60%)`, `circle(40% at center)`)

<!-- prettier-ignore -->
```css
a { width: 30%; }
/**        ↑
 *  This value */
```

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 30%;
}
```

<!-- prettier-ignore -->
```css
a {
  top: 50%;
}
```

<!-- prettier-ignore -->
```css
a {
  transform: translate(10%, 12%);
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 100%;
}
```

<!-- prettier-ignore -->
```css
a {
  top: 0%;
}
```

<!-- prettier-ignore -->
```css
a {
  transform: translate(0%, 30px);
}
```

<!-- prettier-ignore -->
```css
a {
  color: rgb(0 0 0 / 60%);
  border: solid 1px rgb(0 0 0 / 60%);
  background-color: hsl(60 60% 60%);
}
```

> Usage of precent values in colors is allowed

<!-- prettier-ignore -->
```css
a {
  filter: opacity(60%);
}
```

> Usage of percent values in color-related functions is allowed

<!-- prettier-ignore -->
```css
a {
  clip-path: circle(60% at center);
}
```

> Usage of percent values in shape functions is allowed
