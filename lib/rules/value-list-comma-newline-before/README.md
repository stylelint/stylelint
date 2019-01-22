# value-list-comma-newline-before

Require a newline or disallow whitespace before the commas of value lists.

```css
  a { background-size: 0
    , 0; }
/** ↑
 * The newline before these commas */
```

## 选项

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline before the commas.

以下模式被视为违规：

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0,
      0; }
```

以下模式*不*被视为违规：

```css
a { background-size: 0
      , 0; }
```

### `"always-multi-line"`

There *must always* be a newline before the commas in multi-line value lists.

以下模式被视为违规：

```css
a { background-size: 0,
      0; }
```

以下模式*不*被视为违规：

```css
a { background-size: 0, 0; }
```

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0
      , 0; }
```

### `"never-multi-line"`

There *must never* be whitespace before the commas in multi-line value lists.

以下模式被视为违规：

```css
a { background-size: 0
      , 0; }
```

以下模式*不*被视为违规：

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0, 0; }
```

```css
a { background-size: 0,
      0; }
```
