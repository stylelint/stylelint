# value-list-comma-newline-after

Require a newline or disallow whitespace after the commas of value lists.

```css
a { background-size: 0,
      0; }            ↑
/**                   ↑
 * The newline after these commas */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的大多数问题。

## 选项

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline after the commas.

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
a { background-size: 0,
      0; }
```

### `"always-multi-line"`

There *must always* be a newline after the commas in multi-line value lists.

以下模式被视为违规：

```css
a { background-size: 0
    , 0; }
```

以下模式*不*被视为违规：

```css
a { background-size: 0, 0; }
```

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0,
      0; }
```

### `"never-multi-line"`

There *must never* be whitespace after the commas in multi-line value lists.

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
a { background-size: 0
      ,0; }
```
