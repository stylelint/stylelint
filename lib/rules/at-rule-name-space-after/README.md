# at-rule-name-space-after

Require a single space after at-rule names.

```css
@media (max-width: 600px) {}
/**   ↑
 * The space after at-rule names */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"always-single-line"`

### `"always"`

There *must always* be a single space after at-rule names.

以下模式被视为违规：

```css
@charset"UTF-8";
```

```css
@media(min-width: 700px) {}
```

```css
@media  (min-width: 700px) {}
```

```css
@media
(min-width: 700px) {}
```

以下模式*不*被视为违规：

```css
@charset "UTF-8";
```

```css
@import url("x.css");
```

```css
@media (min-width: 700px) {}
```

### `"always-single-line"`

There *must always* be a single space after at-rule names in single-line declaration blocks.

以下模式被视为违规：

```css
@charset"UTF-8";
```

```css
@media(min-width: 700px) {}
```

```css
@media  (min-width: 700px) {}
```

以下模式*不*被视为违规：

```css
@charset "UTF-8";
```

```css
@import url("x.css");
```

```css
@media (min-width: 700px) {}
```

```css
@media
(min-width: 700px) {}
```

```css
@media(min-width: 700px) and
  (orientation: portrait) {}
```

```css
@media
  (min-width: 700px) and
  (orientation: portrait) {}
```
