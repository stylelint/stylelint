# media-feature-name-case

Specify lowercase or uppercase for media feature names.

```css
@media (min-width: 700px) {}
/**     ↑
 * These media feature names */
```

This rule ignores media feature names within a range context.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"lower"|"upper"`

### `"lower"`

以下模式被视为违规：

```css
@media (MIN-WIDTH: 700px) {}
```

```css
@media not all and (MONOCHROME) {}
```

```css
@media (min-width: 700px) and (ORIENTATION: landscape) {}
```

以下模式*不*被视为违规：

```css
@media (min-width: 700px) {}
```

```css
@media not all and (monochrome) {}
```

```css
@media (min-width: 700px) and (orientation: landscape) {}
```

### `"upper"`

以下模式被视为违规：

```css
@media (min-width: 700px) {}
```

```css
@media not all and (monochrome) {}
```

```css
@media (MIN-WIDTH: 700px) and (orientation: landscape) {}
```

以下模式*不*被视为违规：

```css
@media (MIN-WIDTH: 700px) {}
```

```css
@media not all and (MONOCHROME) {}
```

```css
@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) {}
```
