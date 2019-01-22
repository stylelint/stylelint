# comment-empty-line-before

Require or disallow an empty line before comments.

```css
a {}
              /* ← */
/* comment */ /* ↑ */
/**              ↑
*        This line */
```

This rule ignores:

-   comments that are the very first node in the source
-   shared-line comments
-   single-line comments with `//` (when you're using a custom syntax that supports them)
-   comments within selector and value lists

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。我们建议启用 [`indentation`](../indentation/README.md) 规则，以便更好地使用此规则自动修复结果。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be an empty line before comments.

以下模式被视为违规：

```css
a {}
/* comment */
```

以下模式*不*被视为违规：

```css
a {}

/* comment */
```

```css
a {} /* comment */
```

### `"never"`

There *must never* be an empty line before comments.

以下模式被视为违规：

```css
a {}

/* comment */
```

以下模式*不*被视为违规：

```css
a {}
/* comment */
```

```css
a {} /* comment */
```

## 可选的辅助选项

### `except: ["first-nested"]`

Reverse the primary option for comments that are nested and the first child of their parent node.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {

  /* comment */
  color: pink;
}
```

以下模式*不*被视为违规：

```css
a {
  /* comment */
  color: pink;
}
```

### `ignore: ["after-comment", "stylelint-commands"]`

#### `"after-comment"`

Don't require an empty line after a comment.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a {
  background: pink;

  /* comment */
  /* comment */
  color: #eee;
}
```

```css
a {
  background: pink;

  /* comment */

  /* comment */
  color: #eee;
}
```

#### `"stylelint-commands"`

Ignore comments that deliver commands to stylelint, e.g. `/* stylelint-disable color-no-hex */`.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {
  background: pink;
  /* not a stylelint command */
  color: #eee;
}
```

以下模式*不*被视为违规：

```css
a {
  background: pink;
  /* stylelint-disable color-no-hex */
  color: pink;
}
```
