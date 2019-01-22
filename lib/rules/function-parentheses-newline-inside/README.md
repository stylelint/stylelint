# function-parentheses-newline-inside

Require a newline or disallow whitespace on the inside of the parentheses of functions.

```css
  a {
    transform: translate(
      1,             /* ↑ */
      1              /* ↑ */
    );               /* ↑ */
  }                  /* ↑ */
/** ↑                   ↑
 * The newline inside these two parentheses */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline inside the parentheses.

以下模式被视为违规：

```css
a { transform: translate(1, 1); }
```

```css
a { transform: translate(1,
  1
  ); }
```

以下模式*不*被视为违规：

```css
a {
  transform: translate(
    1, 1
  );
}
```

```css
a {
  transform: translate(
    1,
    1
  );
}
```

### `"always-multi-line"`

There *must always* be a newline inside the parentheses of multi-line functions.

以下模式被视为违规：

```css
a { transform: translate(1,
  1) }
```

以下模式*不*被视为违规：

```css
a { transform: translate(1, 1) }
```

```css
a { transform: translate( 1, 1 ) }
```

```css
a {
  transform: translate(
    1, 1
  );
}
```

```css
a {
  transform: translate(
    1,
    1
  );
}
```

### `"never-multi-line"`

以下模式被视为违规：

```css
a {
  transform: translate(
    1, 1
  );
}
```

```css
a {
  transform: translate(
    1,
    1
  );
}
```

以下模式*不*被视为违规：

```css
a { transform: translate(1, 1) }
```

```css
a { transform: translate( 1, 1 ) }
```

```css
a { transform: translate(1,
  1) }
```
