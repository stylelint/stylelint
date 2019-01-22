# unit-no-unknown

Disallow unknown units.

```css
a { width: 100pixels; }
/**           ↑
 *  These units */
```

This rule considers units defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

## 选项

### `true`

以下模式被视为违规：

```css
a {
  width: 10pixels;
}
```

```css
a {
  width: calc(10px + 10pixels);
}
```

以下模式*不*被视为违规：

```css
a {
  width: 10px;
}
```

```css
a {
  width: 10Px;
}
```

```css
a {
  width: 10pX;
}
```

```css
a {
  width: calc(10px + 10px);
}
```

## 可选的辅助选项

### `ignoreUnits: ["/regex/", /regex/, "string"]`

给定：

```js
["/^my-/", "custom"]
```

以下模式*不*被视为违规：

```css
width: 10custom;
a {
}
```

```css
a {
  width: 10my-unit;
}
```

```css
a {
  width: 10my-other-unit;
}
```

### `ignoreFunctions: ["/regex/", /regex/, "string"]`

给定：

```js
["image-set", "/^my-/", "/^YOUR-/i"]
```

以下模式*不*被视为违规：

```css
a {
  background-image: image-set(
    '/images/some-image-1x.jpg' 1x,
    '/images/some-image-2x.jpg' 2x,
    '/images/some-image-3x.jpg' 3x
  );
}
```

```css
a {
  background-image: my-image-set(
    '/images/some-image-1x.jpg' 1x,
    '/images/some-image-2x.jpg' 2x,
    '/images/some-image-3x.jpg' 3x
  );
}
```

```css
a {
  background-image: YoUr-image-set(
    '/images/some-image-1x.jpg' 1x,
    '/images/some-image-2x.jpg' 2x,
    '/images/some-image-3x.jpg' 3x
  );
}
```
