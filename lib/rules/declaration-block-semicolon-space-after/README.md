# declaration-block-semicolon-space-after

Require a single space or disallow whitespace after the semicolons of declaration blocks.

```css
a { color: pink; top: 0; }
/**            ↑
 * The space after this semicolon */
```

This rule ignores:

-   semicolons that are preceded by Less mixins
-   the last semicolon of declaration blocks

Use the `block-closing-brace-*-before` rules to control the whitespace between the last semicolon and the closing brace instead.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There *must always* be a single space after the semicolon.

以下模式被视为违规：

```css
a { color: pink;top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```

以下模式*不*被视为违规：

```css
a { color: pink;}
```

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

### `"never"`

There *must never* be whitespace after the semicolon.

以下模式被视为违规：

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```

以下模式*不*被视为违规：

```css
a { color: pink;}
```

```css
a { color: pink; }
```

```css
a { color: pink;top: 0; }
```

### `"always-single-line"`

There *must always* be a single space after the semicolon in single-line declaration blocks.

以下模式被视为违规：

```css
a { color: pink;top: 0; }
```

以下模式*不*被视为违规：

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```

### `"never-single-line"`

There *must never* be whitespace after the semicolon in single-line declaration blocks.

以下模式被视为违规：

```css
a { color: pink; top: 0; }
```

以下模式*不*被视为违规：

```css
a { color: pink;top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```
