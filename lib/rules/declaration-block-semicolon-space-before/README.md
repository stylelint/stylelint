# declaration-block-semicolon-space-before

Require a single space or disallow whitespace before the semicolons of declaration blocks.

```css
a { color: pink; }
/**            ↑
 * The space before this semicolon */
```

This rule ignores semicolons that are preceded by Less mixins.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There *must always* be a single space before the semicolons.

以下模式被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

以下模式*不*被视为违规：

```css
a { color: pink ; }
```

```css
a { color: pink ; top: 0 ; }
```

### `"never"`

There *must never* be whitespace before the semicolons.

以下模式被视为违规：

```css
a { color: pink ; }
```

```css
a { color: pink ; top: 0 ; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

### `"always-single-line"`

There *must always* be a single space before the semicolons in single-line declaration blocks.

以下模式被视为违规：

```css
a { color: pink; }
```

以下模式*不*被视为违规：

```css
a { color: pink ; }
```

```css
a { color: pink; top: 0; }
```

```css
a { color: pink ; top: 0 ; }
```

### `"never-single-line"`

There *must never* be whitespace before the semicolons in single-line declaration blocks.

以下模式被视为违规：

```css
a { color: pink ; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

```css
a { color: pink ; top: 0 ; }
```
