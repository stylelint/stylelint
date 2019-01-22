# declaration-block-no-duplicate-properties

Disallow duplicate properties within declaration blocks.

```css
a { color: pink; color: orange; }
/** ↑            ↑
 * These duplicated properties */
```

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

## 选项

### `true`

以下模式被视为违规：

```css
a { color: pink; color: orange; }
```

```css
a { color: pink; background: orange; color: orange }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink; background: orange; }
```

## 可选的辅助选项

### `ignore: ["consecutive-duplicates"]`

Ignore consecutive duplicated properties.

They can prove to be useful fallbacks for older browsers.

以下模式被视为违规：

```css
p {
  font-size: 16px;
  font-weight: 400;
  font-size: 1rem;
}
```

以下模式*不*被视为违规：

```css
p {
  font-size: 16px;
  font-size: 1rem;
  font-weight: 400;
}
```

### `ignore: ["consecutive-duplicates-with-different-values"]`

Ignore consecutive duplicated properties with different values.

Including duplicate properties (fallbacks) is useful to deal with older browsers support for CSS properties. E.g. using 'px' units when 'rem' isn't available.

以下模式被视为违规：

```css
/* properties with the same value */
p {
  font-size: 16px;
  font-size: 16px;
  font-weight: 400;
}
```

```css
/* nonconsecutive duplicates */
p {
  font-size: 16px;
  font-weight: 400;
  font-size: 1rem;
}
```

以下模式*不*被视为违规：

```css
p {
  font-size: 16px;
  font-size: 1rem;
  font-weight: 400;
}
```

### `ignoreProperties: ["/regex/", "non-regex"]`

Ignore duplicates of specific properties.

给定：

```js
["color", "/background\-/"]
```

以下模式被视为违规：

```css
a { color: pink; background: orange; background: white; }
```

```css
a { background: orange; color: pink; background: white; }
```

以下模式*不*被视为违规：

```css
a { color: pink; color: orange; background-color: orange; background-color: white; }
```

```css
a { color: pink; background-color: orange; color: orange; background-color: white; }
```
