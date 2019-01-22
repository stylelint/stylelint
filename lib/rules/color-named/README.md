# color-named

Require (where possible) or disallow named colors.

```css
a { color: black }
/**        ↑
 * These named colors */
```

## 选项

`string`: `"always-where-possible"|"never"`

### `"always-where-possible"`

Colors *must always*, where possible, be named.

This will complain if a hex (3, 4, 6 and 8 digit), `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()` or `gray()` color can be represented as a named color.

以下模式被视为违规：

```css
a { color: #000; }
```

```css
a { color: #f000; }
```

```css
a { color: #ff000000; }
```

```css
a { color: rgb(0, 0, 0); }
```

```css
a { color: rgb(0%, 0%, 0%); }
```

```css
a { color: rgba(0, 0, 0, 0); }
```

```css
a { color: hsl(0, 0%, 0%); }
```

```css
a { color: hwb(0, 0%, 100%); }
```

```css
a { color: gray(0); }
```

以下模式*不*被视为违规：

```css
a { color: black; }
```

```css
a { color: rgb(10, 0, 0); }
```

```css
a { color: rgb(0, 0, 0, 0.5); }
```

### `"never"`

Colors *must never* be named.

以下模式被视为违规：

```css
a { color: black; }
```

```css
a { color: white; }
```

以下模式*不*被视为违规：

```css
a { color: #000; }
```

```css
a { color: rgb(0, 0, 0); }
```

```css
a { color: var(--white); }
```

```scss
a { color: $blue; }
```

```less
a { color: @blue; }
```

## 可选的辅助选项

### `ignore: ["inside-function"]`

Ignore colors that are inside a function.

For example, with `"never"`.

以下模式*不*被视为违规：

```css
a {
  color: map-get($colour, blue);
}
```

```css
a {
  background-image: url(red);
}
```

### `ignoreProperties: ["/regex/", /regex/, "string"]`

For example with `"never"`.

给定：

```js
["/^my-/", "composes"]
```

以下模式*不*被视为违规：

```css
a {
  my-property: red;
}
```

```css
a {
  my-other-property: red;
}
```

```css
a {
  composes: red from './index.css';
}
```
