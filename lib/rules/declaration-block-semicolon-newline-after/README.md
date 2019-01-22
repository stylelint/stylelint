# declaration-block-semicolon-newline-after

Require a newline or disallow whitespace after the semicolons of declaration blocks.

```css
a {
  color: pink;
  top: 0;    ↑
}            ↑
/**          ↑
 * The newline after this semicolon */
```

This rule ignores:

-   semicolons that are preceded by Less mixins
-   the last semicolon of declaration blocks

Use the `block-closing-brace-*-before` rules to control the whitespace between the last semicolon and the closing brace instead.

This rule allows an end-of-line comment followed by a newline. For example,

```css
a {
  color: pink; /* end-of-line comment */
  top: 0;
}
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline after the semicolon.

以下模式被视为违规：

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink; /* end-of-line comment
    containing a newline */
  top: 0;
}
```

以下模式*不*被视为违规：

```css
a {
  color: pink;
  top: 0;
}
```

```css
a {
  color: pink; /* end-of-line comment */
  top: 0;
}
```

### `"always-multi-line"`

There *must always* be a newline after the semicolon in multi-line rules.

以下模式被视为违规：

```css
a {
  color: pink; top: 0;
}
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```

### `"never-multi-line"`

There *must never* be whitespace after the semicolon in multi-line rules.

以下模式被视为违规：

```css
a {
  color: pink;
  top: 0;
}
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink
  ; top: 0;
}
```
