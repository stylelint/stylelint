# declaration-block-semicolon-newline-before

Require a newline or disallow whitespace before the semicolons of declaration blocks.

```css
  a {
    color: pink
    ; top: 0;
  } ↑
/** ↑
 * The newline before this semicolon */
```

This rule ignores semicolons that are preceded by Less mixins.

## 选项

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline before the semicolons.

以下模式被视为违规：

```css
a { color: pink; }
```

```css
a {
  color: pink; top: 0;
}
```

以下模式*不*被视为违规：

```css
a { color: pink
; }
```

```css
a {
  color: pink
  ; top: 0;
}
```

### `"always-multi-line"`

There *must always* be a newline before the semicolons in multi-line rules.

以下模式被视为违规：

```css
a {
  color: pink; top: 0;
}
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink
  ; top: 0;
}
```

### `"never-multi-line"`

There *must never* be whitespace before the semicolons in multi-line rules.

以下模式被视为违规：

```css
a {
  color: pink
  ; top: 0;
}
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

```css
a {
  color: pink;
  top: 0;
}
```
