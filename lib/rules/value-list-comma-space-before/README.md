# value-list-comma-space-before

Require a single space or disallow whitespace before the commas of value lists.

```css
a { background-size: 0 ,0; }
/**                    ↑
 * The space before these commas */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的大多数问题。

## 选项

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There *must always* be a single space before the commas.

以下模式被视为违规：

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0
      , 0; }
```

以下模式*不*被视为违规：

```css
a { background-size: 0 ,0; }
```

```css
a { background-size: 0 ,
      0; }
```

### `"never"`

There *must never* be whitespace before the commas.

以下模式被视为违规：

```css
a { background-size: 0 ,0; }
```

```css
a { background-size: 0 ,
      0; }
```

以下模式*不*被视为违规：

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0,
      0; }
```

### `"always-single-line"`

There *must always* be a single space before the commas in single-line value lists.

以下模式被视为违规：

```css
a { background-size: 0,0; }
```

以下模式*不*被视为违规：

```css
a { background-size: 0 ,0; }
```

```css
a { background-size: 0 ,
      0; }
```

```css
a { background-size: 0
      , 0; }
```

### `"never-single-line"`

There *must never* be whitespace before the commas in single-line value lists.

以下模式被视为违规：

```css
a { background-size: 0 ,0; }
```

以下模式*不*被视为违规：

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0,
      0; }
```

```css
a { background-size: 0 ,
      0; }
```
