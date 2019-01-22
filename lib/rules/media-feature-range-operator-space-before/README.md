# media-feature-range-operator-space-before

Require a single space or disallow whitespace before the range operator in media features.

```css
@media (width >= 600px) {}
/**           ↑
 * The space before this */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space before the range operator.

以下模式被视为违规：

```css
@media (width>=600px) {}
```

```css
@media (width>= 600px) {}
```

以下模式*不*被视为违规：

```css
@media (width >=600px) {}
```

```css
@media (width >= 600px) {}
```

### `"never"`

There *must never* be whitespace before the range operator.

以下模式被视为违规：

```css
@media (width >=600px) {}
```

```css
@media (width >= 600px) {}
```

以下模式*不*被视为违规：

```css
@media (width>=600px) {}
```

```css
@media (width>= 600px) {}
```
