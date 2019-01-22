# custom-property-empty-line-before

Require or disallow an empty line before custom properties.

```css
a {
  top: 10px;
                          /* ← */
  --foo: pink;            /* ↑ */
}                         /* ↑ */
/**                          ↑
 *                   This line */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。我们建议启用 [`indentation`](../indentation/README.md) 规则，以便更好地使用此规则自动修复结果。

## 选项

`string`: `"always"|"never"`

### `"always"`

以下模式被视为违规：

```css
a {
  top: 10px;
  --foo: pink;
  --bar: red;
}
```

以下模式*不*被视为违规：

```css
a {
  top: 10px;

  --foo: pink;

  --bar: red;
}
```

### `"never"`

以下模式被视为违规：

```css
a {
  top: 10px;

  --foo: pink;

  --bar: red;
}
```

```css
a {

  --foo: pink;
  --bar: red;
}
```

以下模式*不*被视为违规：

```css
a {
  top: 10px;
  --foo: pink;
  --bar: red;
}
```

```css
a {
  --foo: pink;
  --bar: red;
}
```

## 可选的辅助选项

### `except: ["after-comment", "after-custom-property", "first-nested"]`

#### `"after-comment"`

Reverse the primary option for custom properties that come after a comment.

Shared-line comments do not trigger this option.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {

  --foo: pink;
  /* comment */

  --bar: red;
}
```

```css
a {

  --foo: pink; /* comment */
  --bar: red;
}
```

以下模式*不*被视为违规：

```css
a {

  --foo: pink;
  /* comment */
  --bar: red;
}
```

```css
a {

  --foo: pink; /* comment */

  --bar: red;
}
```

#### `"after-custom-property"`

Reverse the primary option for custom properties that come after another custom property.

Shared-line comments do not affect this option.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {

  --foo: pink;

  --bar: red;
}
```

```css
a {

  --foo: pink; /* comment */

  --bar: red;
}
```

以下模式*不*被视为违规：

```css
a {

  --foo: pink;
  --bar: red;
}
```

```css
a {

  --foo: pink; /* comment */
  --bar: red;
}
```

#### `"first-nested"`

Reverse the primary option for custom properties that are nested and the first child of their parent node.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {

  --foo: pink;

  --bar: red;
}
```

以下模式*不*被视为违规：

```css
a {
  --foo: pink;

  --bar: red;
}
```

### `ignore: ["after-comment", "first-nested", "inside-single-line-block"]`

#### `"after-comment"`

Ignore custom properties that are preceded by comments.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a {
  /* comment */
  --foo: pink;
}
```

#### `"first-nested"`

Ignore custom properties that are nested and the first child of their parent node.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a {
  --foo: pink;

  --bar: red;
}
```

#### `"inside-single-line-block"`

Ignore custom properties that are inside single-line blocks.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a { --foo: pink; --bar: red; }
```
