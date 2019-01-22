# block-opening-brace-space-after

Require a single space or disallow whitespace after the opening brace of blocks.

```css
  a { color: pink; }
/** ↑
 * The space after this brace */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a single space after the opening brace.

以下模式被视为违规：

```css
a {color: pink; }
```

```css
a {
color: pink; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink;
}
```

### `"never"`

There *must never* be whitespace after the opening brace.

以下模式被视为违规：

```css
a { color: pink; }
```

```css
a {
color: pink; }
```

以下模式*不*被视为违规：

```css
a {color: pink; }
```

```css
a
{color: pink; }
```

### `"always-single-line"`

There *must always* be a single space after the opening brace in single-line blocks.

以下模式被视为违规：

```css
a {color: pink; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a {color: pink;
}
```

### `"never-single-line"`

There *must never* be whitespace after the opening brace in single-line blocks.

以下模式被视为违规：

```css
a { color: pink; }
```

以下模式*不*被视为违规：

```css
a {color: pink; }
```

```css
a { color: pink;
}
```

### `"always-multi-line"`

There *must always* be a single space after the opening brace in multi-line blocks.

以下模式被视为违规：

```css
a {color: pink;
}
```

以下模式*不*被视为违规：

```css
a {color: pink; }
```

```css
a { color: pink;
}
```

### `"never-multi-line"`

There *must never* be whitespace after the opening brace in multi-line blocks.

以下模式被视为违规：

```css
a { color: pink;
}
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a {color: pink;
}
```
