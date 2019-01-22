# block-closing-brace-newline-after

Require a newline or disallow whitespace after the closing brace of blocks.

```css
a { color: pink; }
a { color: red; }↑
/**              ↑
 * The newline after this brace */
```

This rule allows an end-of-line comment separated from the closing brace by spaces, as long as the comment contains no newlines. For example,

```css
a {
  color: pink;
} /* end-of-line comment */
```

This rule allows a trailing semicolon after the closing brace of a block. For example,

```css
:root {
  --toolbar-theme: {
    background-color: hsl(120, 70%, 95%);
  };
/* ↑
 * This semicolon */
}
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline after the closing brace.

以下模式被视为违规：

```css
a { color: pink; }b { color: red; }
```

```css
a { color: pink;
} b { color: red; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
b { color: red; }
```

### `"always-single-line"`

There *must always* be a newline after the closing brace in single-line blocks.

以下模式被视为违规：

```css
a { color: pink; } b { color: red; }
```

以下模式*不*被视为违规：

```css
a { color: pink;
} b { color: red; }
```

```css
a { color: pink; }
b { color: red; }
```

### `"never-single-line"`

There *must never* be whitespace after the closing brace in single-line blocks.

以下模式被视为违规：

```css
a { color: pink; } b { color: red; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }b { color: red; }
```

```css
a { color: pink;
} b { color: red; }
```

### `"always-multi-line"`

There *must always* be a newline after the closing brace in multi-line blocks.

以下模式被视为违规：

```css
a { color: pink;
}b { color: red; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }b { color: red; }
```

```css
a { color: pink;
}
b { color: red; }
```

### `"never-multi-line"`

There *must never* be whitespace after the closing brace in multi-line blocks.

以下模式被视为违规：

```css
a { color: pink;
} b { color: red; }
```

以下模式*不*被视为违规：

```css
a { color: pink; } b { color: red; }
```

```css
a { color: pink;
}b { color: red; }
```

## 可选的辅助选项

### `ignoreAtRules: ["/regex/", "non-regex"]`

Ignore specified at-rules.

For example, with `"always"` or `"always-multi-line"`.

给定：

```js
["if", "else"]
```

以下模式*不*被视为违规：

```css
@if ($var) {
  color: pink;
} @else if ($var2) {
  color: red;
} @else {
  color: blue;
}
```

```css
@if ($var) { color: pink; } @else { color: blue; }
```
