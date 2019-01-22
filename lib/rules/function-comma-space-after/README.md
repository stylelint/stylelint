# function-comma-space-after

Require a single space or disallow whitespace after the commas of functions.

```css
a { transform: translate(1, 1) }
/**                       ↑
 * The space after these commas */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There *must always* be a single space after the commas.

以下模式被视为违规：

```css
a { transform: translate(1,1) }
```

```css
a { transform: translate(1 ,1) }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1, 1) }
```

```css
a { transform: translate(1 , 1) }
```

### `"never"`

There *must never* be whitespace after the commas.

以下模式被视为违规：

```css
a { transform: translate(1, 1) }
```

```css
a { transform: translate(1 , 1) }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1,1) }
```

```css
a { transform: translate(1 ,1) }
```

### `"always-single-line"`

There *must always* be a single space after the commas in single-line functions.

以下模式被视为违规：

```css
a { transform: translate(1,1) }
```

```css
a { transform: translate(1 ,1) }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1, 1) }
```

```css
a { transform: translate(1 , 1) }
```

```css
a {
  transform: translate(1
    ,1)
}
```

### `"never-single-line"`

There *must never* be whitespace after the commas in single-line functions.

以下模式被视为违规：

```css
a { transform: translate(1, 1) }
```

```css
a { transform: translate(1 , 1) }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1,1) }
```

```css
a { transform: translate(1 ,1) }
```

```css
a {
  transform: translate(1
    , 1)
}
```
