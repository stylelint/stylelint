# declaration-colon-newline-after

Require a newline or disallow whitespace after the colon of declarations.

```css
a {
  box-shadow:
    0 0 0 1px #5b9dd9,
    0 0 2px 1px rgba(30, 140, 190, 0.8);
}        /* ↑ */
/**         ↑
 * The newline after this colon */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"always-multi-line"`

### `"always"`

There *must always* be a newline after the colon.

以下模式被视为违规：

```css
a { color:pink; }
```

```css
a { color: pink; }
```

以下模式*不*被视为违规：

```css
a {
  color:
    pink;
}
```

### `"always-multi-line"`

There *must always* be a newline after the colon *if the declaration's value is multi-line*.

以下模式被视为违规：

```css
a {
  box-shadow: 0 0 0 1px #5b9dd9,
    0 0 2px 1px rgba(30, 140, 190, 0.8);
}
```

以下模式*不*被视为违规：

```css
a {
  box-shadow:
    0 0 0 1px #5b9dd9,
    0 0 2px 1px rgba(30, 140, 190, 0.8);
}
```

```css
a {
  color: pink;
}
```
