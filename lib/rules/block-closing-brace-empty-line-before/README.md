# block-closing-brace-empty-line-before

Require or disallow an empty line before the closing brace of blocks.

```css
a {
  color: pink;
  /* ← */
} /* ↑ */
/**  ↑
 * This line */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always-multi-line"|"never"`

### `always-multi-line`

以下模式被视为违规：

```css
a {
  color: pink;
}
```

以下模式*不*被视为违规：

```css
a {
  color: pink;

}
```

```css
a { color: pink; }
```

### `never`

以下模式被视为违规：

```css
a {
  color: pink;

}
```

以下模式*不*被视为违规：

```css
a {
  color: pink;
}
```

```css
a { color: pink; }
```

## 可选的辅助选项

### `except: ["after-closing-brace"]`

When a rule is nested, `after-closing-brace` brace will reverse the primary option.

例如，使用 `"never"` 和 `except: ["after-closing-brace"]`：

以下模式被视为违规：

```css
@media print {

  a {
    color: aquamarine;
  }
}
```

```css
@supports (animation-name: test) {

  a {
    color: aquamarine;
  }
}
```

```css
@keyframes test {

  100% {
    color: aquamarine;
  }
}
```

以下模式*不*被视为违规：

```css
@media print {

  a {
    color: aquamarine;
  }

}
```

```css
@font-face {
  font-family: "MyFont";
  src: url("myfont.woff2") format("woff2");
}
```

```css
@supports (animation-name: test) {

  a {
    color: aquamarine;
  }

}
```

```css
@keyframes test {

  100% {
    color: aquamarine;
  }

}
```

例如，使用 `"always-multi-line"` 和 `except: ["after-closing-brace"]`：

以下模式被视为违规：

```css
@media print {

  a {
    color: aquamarine;

  }

}
```

```css
@supports (animation-name: test) {

  a {
    color: aquamarine;

  }

}
```

```css
@keyframes test {

  100% {
    color: aquamarine;

  }

}
```

以下模式*不*被视为违规：

```css
@media print {

  a {
    color: aquamarine;

  }
}
```

```css
@font-face {
  font-family: "MyFont";
  src: url("myfont.woff2") format("woff2");

}
```

```css
@supports (animation-name: test) {

  a {
    color: aquamarine;

  }
}
```

```css
@keyframes test {

  100% {
    color: aquamarine;

  }
}
```
