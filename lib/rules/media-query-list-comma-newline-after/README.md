# media-query-list-comma-newline-after

Require a newline or disallow whitespace after the commas of media query lists.

```css
@media screen and (color),
  projection {}       /* ↑ */
/**                      ↑
 *            These commas */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline after the commas.

以下模式被视为违规：

```css
@media screen and (color), projection and (color) {}
```

```css
@media screen and (color)
, projection and (color) {}
```

以下模式*不*被视为违规：

```css
@media screen and (color),
projection and (color) {}
```

```css
@media screen and (color)
,
projection and (color) {}
```

### `"always-multi-line"`

There *must always* be a newline after the commas in multi-line media query lists.

以下模式被视为违规：

```css
@media screen and (color)
, projection and (color) {}
```

以下模式*不*被视为违规：

```css
@media screen and (color), projection and (color) {}
```

```css
@media screen and (color),
projection and (color) {}
```

```css
@media screen and (color)
,
projection and (color) {}
```

### `"never-multi-line"`

There *must never* be a white after the commas in multi-line media query lists.

以下模式被视为违规：

```css
@media screen and (color),
projection and (color) {}
```

```css
@media screen and (color)
,
projection and (color) {}
```

以下模式*不*被视为违规：

```css
@media screen and (color), projection and (color) {}
```

```css
@media screen and (color)
,projection and (color) {}
```
