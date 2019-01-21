# no-extra-semicolons

不允许额外的分号。

```css
a { color: pink;; }
/**             ↑
 *  This semicolons */
```

此规则忽略在 Less mixins 之后的分号。

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

### `true`

以下模式被视为违规：

```css
@import "x.css";;
```

```css
@import "x.css";
;
```

```css
a {
  color: pink;;
}
```

```css
a {
  ;color: pink;
}
```

```css
a {
  color: pink;
  ;
}
```

```css
a {
  color: red;
}
;
b {
  color: white;
}
```

以下模式*不*被视为违规：

```css
@import "x.css";
```

```css
a {
  color: pink;
}
```
