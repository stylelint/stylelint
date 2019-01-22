# declaration-block-trailing-semicolon

Require or disallow a trailing semicolon within declaration blocks.

```css
a { background: orange; color: pink; }
/**                                ↑
 *                    This semicolon */
```

The trailing semicolon is the *last* semicolon in a declaration block and it is optional.

This rule ignores:

-   Less mixins
-   trailing `//` comments
-   declaration blocks containing nested (at-)rules

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be a trailing semicolon.

以下模式被视为违规：

```css
a { color: pink }
```

```css
a { background: orange; color: pink }
```

```css
a { @include foo }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { background: orange; color: pink; }
```

```css
a { @include foo; }
```

### `"never"`

There *must never* be a trailing semicolon.

以下模式被视为违规：

```css
a { color: pink; }
```

```css
a { background: orange; color: pink; }
```

以下模式*不*被视为违规：

```css
a { color: pink }
```

```css
a { background: orange; color: pink }
```
