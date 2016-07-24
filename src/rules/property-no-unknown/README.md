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

### `ignoreProperties: ["/regex/", "string"]`

Given:

```js
["/^my-/", "custom"]
```

The following patterns are *not* considered warnings:

```css
.foo {
  my-property: 10px;
}
```

```css
.foo {
  my-other-property: 10px;
}
```

```css
.foo {
  custom: 10px;
}
```
