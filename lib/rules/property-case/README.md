# property-case

Specify lowercase or uppercase for properties.

```css
    a { width: 1px; }
/**     ↑
 * These properties */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"lower"|"upper"`

### `"lower"`

以下模式被视为违规：

```css
a {
  Width: 1px
}
```

```css
a {
  WIDTH: 1px
}
```

```css
a {
  widtH: 1px
}
```

```css
a {
  border-Radius: 5px;
}
```

```css
a {
  -WEBKIT-animation-duration: 3s;
}
```

```css
@media screen and (orientation: landscape) {
  WiDtH: 500px;
}
```

以下模式*不*被视为违规：

```css
a {
  width: 1px
}
```

```css
a {
  border-radius: 5px;
}
```

```css
a {
  -webkit-animation-duration: 3s;
}
```

```css
@media screen and (orientation: landscape) {
  width: 500px;
}
```

### `"upper"`

以下模式被视为违规：

```css
a {
  Width: 1px
}
```

```css
a {
  width: 1px
}
```

```css
a {
  widtH: 1px
}
```

```css
a {
  border-Radius: 5px;
}
```

```css
a {
  -WEBKIT-animation-duration: 3s;
}
```

```css
@media screen and (orientation: landscape) {
  WiDtH: 500px;
}
```

以下模式*不*被视为违规：

```css
a {
  WIDTH: 1px
}
```

```css
a {
  BORDER-RADIUS: 5px;
}
```

```css
a {
  -WEBKIT-ANIMATION-DURATION: 3s;
}
```

```css
@media screen and (orientation: landscape) {
  WIDTH: 500px;
}
```
