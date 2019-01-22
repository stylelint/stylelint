# function-parentheses-space-inside

Require a single space or disallow whitespace on the inside of the parentheses of functions.

```css
a { transform: translate( 1, 1 ); }
/**                     ↑      ↑
 * The space inside these two parentheses */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There *must always* be a single space inside of the parentheses.

以下模式被视为违规：

```css
a { transform: translate(1, 1); }
```

```css
a { transform: translate(1, 1 ); }
```

以下模式*不*被视为违规：

```css
a { transform: translate( 1, 1 ); }
```

### `"never"`

There *must never* be whitespace on the inside of the parentheses.

以下模式被视为违规：

```css
a { transform: translate( 1, 1 ); }
```

```css
a { transform: translate(1, 1 ); }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1, 1); }
```

### `"always-single-line"`

There *must always* be a single space inside the parentheses of single-line functions.

以下模式被视为违规：

```css
a { transform: translate(1, 1) }
```

```css
a { transform: translate(1, 1 ) }
```

以下模式*不*被视为违规：

```css
a { transform: translate( 1, 1 ) }
```

```css
a { transform: translate(1,
  1) }
```

```css
a {
  transform: translate(
    1,
    1
  )
}
```

### `"never-single-line"`

There *must never* be whitespace inside the parentheses of single-line functions.

以下模式被视为违规：

```css
a { transform: translate( 1, 1 ) }
```

```css
a { transform: translate(1, 1 ) }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1, 1) }
```

```css
a { transform: translate( 1,
  1) }
```

```css
a {
  transform: translate(
    1,
    1
  )
}
```
