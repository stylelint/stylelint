# media-feature-parentheses-space-inside

Require a single space or disallow whitespace on the inside of the parentheses within media features.

```css
@media ( max-width: 300px ) {}
/**    ↑                  ↑
 * The space inside these two parentheses */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space inside the parentheses.

以下模式被视为违规：

```css
@media (max-width: 300px) {}
```

```css
@media (max-width: 300px ) {}
```

以下模式*不*被视为违规：

```css
@media ( max-width: 300px ) {}
```

### `"never"`

There *must never* be whitespace on the inside the parentheses.

以下模式被视为违规：

```css
@media ( max-width: 300px ) {}
```

```css
@media ( max-width: 300px) {}
```

以下模式*不*被视为违规：

```css
@media (max-width: 300px) {}
```
