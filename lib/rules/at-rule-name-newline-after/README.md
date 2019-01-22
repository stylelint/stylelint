# at-rule-name-newline-after

Require a newline after at-rule names.

```css
    @media
   /*↑*/  (max-width: 600px) {}
/**  ↑
 * The newline after this at-rule name */
```

## 选项

`string`: `"always"|"always-multi-line"`

### `"always"`

There *must always* be a newline after at-rule names.

以下模式被视为违规：

```css
@charset "UTF-8";
```

```css
@media (min-width: 700px) and
  (orientation: landscape) {}
```

以下模式*不*被视为违规：

```css
@charset
  "UTF-8";
```

```css
@import
  "x.css" screen and
 (orientation:landscape);
```

```css
@media
  (min-width: 700px) and (orientation: landscape) {}
```

```css
@media
  (min-width: 700px) and
  (orientation: landscape) {}
```

### `"always-multi-line"`

There *must always* be a newline after at-rule names in at-rules with multi-line parameters.

以下模式被视为违规：

```css
@import "x.css" screen and
 (orientation:landscape);
```

```css
@media (min-width: 700px) and
 (orientation: landscape) {}
```

以下模式*不*被视为违规：

```css
@charset "UTF-8";
```

```css
@charset
  "UTF-8";
```

```css
@import "x.css" screen and (orientation:landscape);
```

```css
@media (min-width: 700px) and (orientation: landscape) {}
```

```css
@media
  (min-width: 700px) and
  (orientation: landscape) {}
```
