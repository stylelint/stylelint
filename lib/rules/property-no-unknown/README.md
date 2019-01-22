# property-no-unknown

Disallow unknown properties.

```css
a { heigth: 100%; }
/** ↑
 * These properties */
```

This rule considers properties defined in the [CSS Specifications and browser specific properties](https://github.com/betit/known-css-properties#source) to be known.

This rule ignores:

-   variables (`$sass`, `@less`, `--custom-property`)
-   vendor-prefixed properties (e.g., `-moz-align-self`, `-webkit-align-self`)

Use option `checkPrefixed` described below to turn on checking of vendor-prefixed properties.

## 选项

### `true`

以下模式被视为违规：

```css
a {
  colr: blue;
}
```

```css
a {
  my-property: 1;
}
```

以下模式*不*被视为违规：

```css
a {
  color: green;
}
```

```css
a {
  fill: black;
}
```

```css
a {
  -moz-align-self: center;
}
```

```css
a {
  -webkit-align-self: center;
}
```

```css
a {
  align-self: center;
}
```

## 可选的辅助选项

### `ignoreProperties: ["/regex/", /regex/, "string"]`

给定：

```js
["/^my-/", "custom"]
```

以下模式*不*被视为违规：

```css
a {
  my-property: 10px;
}
```

```css
a {
  my-other-property: 10px;
}
```

```css
a {
  custom: 10px;
}
```

### `checkPrefixed: true | false` (default: `false`)

If `true`, this rule will check vendor-prefixed properties.

For example with `true`:

以下模式*不*被视为违规：

```css
a {
  -webkit-overflow-scrolling: auto;
}
```

```css
a {
  -moz-box-flex: 0;
}
```

The following patterns are considered  violations:

```css
a {
  -moz-align-self: center;
}
```

```css
a {
  -moz-overflow-scrolling: center;
}
```
