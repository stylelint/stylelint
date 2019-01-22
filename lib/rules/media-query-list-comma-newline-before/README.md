# media-query-list-comma-newline-before

Require a newline or disallow whitespace before the commas of media query lists.

```css
    @media screen and (color)
    , projection and (color) {}
/** ↑
 * These commas */
```

## 选项

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline before the commas.

以下模式被视为违规：

```css
@media screen and (color), projection and (color) {}
```

```css
@media screen and (color),
projection and (color) {}
```

以下模式*不*被视为违规：

```css
@media screen and (color)
,projection and (color) {}
```

```css
@media screen and (color)
,
projection and (color) {}
```

### `"always-multi-line"`

There *must always* be a newline before the commas in multi-line media query lists.

以下模式被视为违规：

```css
@media screen and (color),
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

```css
@media screen and (color)
,
projection and (color) {}
```

### `"never-multi-line"`

There *must never* be whitespace before the commas in multi-line media query lists.

以下模式被视为违规：

```css
@media screen and (color)
,projection and (color) {}
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
@media screen and (color),
projection and (color) {}
```
