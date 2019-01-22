# function-whitespace-after

Require or disallow whitespace after functions.

```css
a { transform: translate(1, 1) scale(3); }
/**                           ↑
 *                   This space */
```

This rule does not check for space immediately after `)` if the very next character is `,`, `)`, `/` or `}`, allowing some of the patterns exemplified below.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be whitespace after the function.

以下模式被视为违规：

```css
a { transform: translate(1, 1)scale(3); }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1, 1) scale(3); }
```

```css
a { transform: translate(1, 1)     scale(3); }
```

```css
a {
  transform:
    translate(1, 1)
    scale(3);
}
```

```css
/* notice the two closing parentheses without a space between */
a { top: calc(1 * (1 + 3)); }
```

```css
/* notice the ), with no space after the closing parenthesis */
a { padding: calc(1 * 2px), calc(2 * 5px); }
```

```scss
/* notice the )}, with no space after the closing parenthesis */
a {
  max-height: #{($line-height) * ($lines-to-show)}em;
}
```

```less
/* notice the )}, with no space after the closing parenthesis */
a {
  max-height: ((@line-height) * (@lines-to-show))em;
}
```

### `"never"`

There *must never* be whitespace after the function.

以下模式被视为违规：

```css
a { transform: translate(1, 1) scale(3); }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1, 1)scale(3); }
```
