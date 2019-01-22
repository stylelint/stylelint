# declaration-colon-space-before

Require a single space or disallow whitespace before the colon of declarations.

```css
a { color :pink }
/**       ↑
 * The space before this colon */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space before the colon.

以下模式被视为违规：

```css
a { color: pink }
```

```css
a { color:pink }
```

以下模式*不*被视为违规：

```css
a { color : pink }
```

```css
a { color :pink }
```

### `"never"`

There *must never* be whitespace before the colon.

以下模式被视为违规：

```css
a { color : pink }
```

```css
a { color :pink }
```

以下模式*不*被视为违规：

```css
a { color: pink }
```

```css
a { color:pink }
```
