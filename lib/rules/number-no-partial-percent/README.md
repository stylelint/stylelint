# number-no-partial-percent

Disallow percent size values that are not `0%` or `100%`.

> Usage of any percent values for alpha in colors is still allowed. (e.g. `rgba(0 0 0 / 60%)`)

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
  color: rgb(0 0 0 / 60%);
  border: solid 1px rgb(0 0 0 / 60%);
}
```

> Alpha values in colors are allowed

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
