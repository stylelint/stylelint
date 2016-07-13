# property-no-unknown

Disallow unknown properties.

```css
.foo { heigth: 100%; }
/**    ↑
 * These properties */
```

This rule considers properties defined in the [CSS Specifications and browser specific properties](https://github.com/betit/known-css-properties#source) to be known.

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

## Options

### `true`

The following patterns are considered warnings:

```css
.foo {
  colr: blue;
}
```

```css
.foo {
  -moz-align-self: center;
}
```

The following patterns are *not* considered warnings:

```css
.foo {
  color: green;
}
```

```css
.foo {
  fill: black;
}
```

```css
.foo {
  -webkit-align-self: center;
}
```

```css
.foo {
  align-self: center;
}
```

## Optional options

### `ignoreProperties: ["array", "of", "properties"]`

Allow unknown properties.

Given:

```js
["-moz-overflow-scrolling"]
```

The following patterns are considered warnings:

```css
.foo {
  overflow-scrolling: auto;
}
```

The following patterns are *not* considered warnings:

```css
.foo {
  -webkit-overflow-scrolling: auto;
}
```

```css
.foo {
  -moz-overflow-scrolling: auto;
}
```
