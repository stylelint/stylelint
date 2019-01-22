# block-closing-brace-space-after

Require a single space or disallow whitespace after the closing brace of blocks.

```css
a { color: pink; }
/**              ↑
 * The space after this brace */
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

## 选项

`string`: `"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a single space after the closing brace.

以下模式被视为违规：

```css
a { color: pink; }b { color: red; }
```

```css
a { color: pink; }
b { color: red; }
```

以下模式*不*被视为违规：

```css
a { color: pink; } b { color: red; }
```

### `"never"`

There *must never* be whitespace after the closing brace.

以下模式被视为违规：

```css
a { color: pink; } b { color: red; }
```

```css
a { color: pink; }
b { color: red; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }b { color: red; }
```

```css
a { color: pink;
}b { color: red; }
```

### `"always-single-line"`

There *must always* be a single space after the closing brace in single-line blocks.

以下模式被视为违规：

```css
a { color: pink; }b { color: red; }
```

以下模式*不*被视为违规：

```css
a { color: pink; } b { color: red; }
```

```css
a { color: pink;
}b { color: red; }
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

There *must always* be a single space after the closing brace in multi-line blocks.

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
} b { color: red; }
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
