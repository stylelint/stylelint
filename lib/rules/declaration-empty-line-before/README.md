# declaration-empty-line-before

Require or disallow an empty line before declarations.

```css
a {
  --foo: pink;
             /* ← */
  top: 15px; /* ↑ */
}            /* ↑ */
/**             ↑
 *      This line */
```

This rule only applies to standard property declarations. Use the [`custom-property-empty-line-before`](../custom-property-empty-line-before/README.md) rule for custom property declarations.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。我们建议启用 [`indentation`](../indentation/README.md) 规则，以便更好地使用此规则自动修复结果。

## 选项

`string`: `"always"|"never"`

### `"always"`

以下模式被视为违规：

```css
a {
  --foo: pink;
  top: 5px;
}
```

```css
a {
  bottom: 15px;
  top: 5px;
}
```

以下模式*不*被视为违规：

```css
a {
  --foo: pink;

  top: 5px;
}
```

```css
a {

  bottom: 15px;

  top: 5px;
}
```

### `"never"`

以下模式被视为违规：

```css
a {
  --foo: pink;

  bottom: 15px;
}
```

```css
a {

  bottom: 15px;

  top: 5px;
}
```

以下模式*不*被视为违规：

```css
a {
  --foo: pink;
  bottom: 15px;
}
```

```css
a {
  bottom: 15px;
  top: 5px;
}
```

## 可选的辅助选项

### `except: ["after-comment", "after-declaration", "first-nested"]`

#### `"after-comment"`

Reverse the primary option for declarations that come after a comment.

Shared-line comments do not trigger this option.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {
  /* comment */

  top: 5px;
}
```

```css
a {
  bottom: 5px; /* comment */
  top: 5px;
}
```

以下模式*不*被视为违规：

```css
a {
  /* comment */
  top: 5px;
}

```

```css
a {
  bottom: 5px; /* comment */

  top: 5px;
}

```

#### `"after-declaration"`

Reverse the primary option for declarations that come after another declaration.

Shared-line comments do not affect this option.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {

  bottom: 15px;

  top: 5px;
}
```

```css
a {

  bottom: 15px; /* comment */

  top: 5px;
}
```

以下模式*不*被视为违规：

```css
a {

  bottom: 15px;
  top: 5px;
}
```

```css
a {

  bottom: 15px; /* comment */
  top: 5px;
}
```

#### `"first-nested"`

Reverse the primary option for declarations that are nested and the first child of their parent node.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {

  bottom: 15px;

  top: 5px;
}
```

以下模式*不*被视为违规：

```css
a {
  bottom: 15px;

  top: 5px;
}
```

### `ignore: ["after-comment", "after-declaration", "first-nested", "inside-single-line-block"]`

#### `"after-comment"`

Ignore declarations that are preceded by comments.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a {
  /* comment */
  bottom: 15px;
}
```

#### `"after-declaration"`

Ignore declarations that are preceded by declarations, to allow for multiple declaration sets in the same block.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a {

  bottom: 15px;
  top: 15px;
}
```

```css
a {

  bottom: 15px;

  top: 15px;
}
```

```css
a {

  color: orange;
  text-decoration: none;

  bottom: 15px;
  top: 15px;
}
```

#### `"first-nested"`

Ignore declarations that are nested and the first child of their parent node.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a {
  bottom: 15px;

  top: 5px;
}
```

#### `"inside-single-line-block"`

Ignore declarations that are inside single-line blocks.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a { bottom: 15px; top: 5px; }
```
