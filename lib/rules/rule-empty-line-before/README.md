# rule-empty-line-before

Require or disallow an empty line before rules.

```css
a {}
      /* ← */
b {}  /* ↑ */
/**      ↑
 * This line */
```

This rule ignores rules that are the very first node in a source.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。我们建议启用 [`indentation`](../indentation/README.md) 规则，以便更好地使用此规则自动修复结果。

## 选项

`string`: `"always"|"never"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be an empty line before rules.

以下模式被视为违规：

```css
a {} b {}
```

```css
a {}
b {}
```

以下模式*不*被视为违规：

```css
a {}

b {}
```

### `"never"`

There *must never* be an empty line before rules.

以下模式被视为违规：

```css
a {}

b {}
```

以下模式*不*被视为违规：

```css
a {} b {}
```

```css
a {}
b {}
```

### `"always-multi-line"`

There *must always* be an empty line before multi-line rules.

以下模式被视为违规：

```css
a {
  color: red;
}
b {
  color: blue;
}
```

以下模式*不*被视为违规：

```css
a {
  color: red;
}

b {
  color: blue;
}
```

### `"never-multi-line"`

There *must never* be an empty line before multi-line rules.

以下模式被视为违规：

```css
a {
  color: red;
}

b {
  color: blue;
}
```

以下模式*不*被视为违规：

```css
a {
  color: red;
}
b {
  color: blue;
}
```

## 可选的辅助选项

### `except: ["after-rule", "after-single-line-comment", "inside-block-and-after-rule", "inside-block", "first-nested"]`

#### `"after-rule"`

Reverse the primary option if the rule comes after another rule.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {}

b {}
```

以下模式*不*被视为违规：

```css
a {}
b {}
```

#### `"after-single-line-comment"`

Reverse the primary option if the rule comes after a single-line comment.

例如，使用 `"always"`：

以下模式被视为违规：

```css
/* comment */

a {}
```

以下模式*不*被视为违规：

```css
/* comment */
a {}
```

#### `"inside-block-and-after-rule"`

Reverse the primary option if the rule is inside a block and comes after another rule.

例如，使用 `"always"`：

以下模式被视为违规：

```css
@media {

  a {}

  b {}
}
```

以下模式*不*被视为违规：

```css
@media {
  a {}
  b {}
}
```

#### `"inside-block"`

Reverse the primary option if the rule is inside a block.

例如，使用 `"always"`：

以下模式被视为违规：

```scss
a {
  color: red;

  b {
    color: blue;
  }
}

```

以下模式*不*被视为违规：

```scss
a {
  color: red;
  b {
    color: blue;
  }
}
```

#### `"first-nested"`

Reverse the primary option if the rule is the first in a block.

例如，使用 `"always"`：

以下模式被视为违规：

```css
@media {

  a {}

  b {}
}
```

以下模式*不*被视为违规：

```css
@media {
  a {}

  b {}
}
```

### `ignore: ["after-comment", "first-nested", "inside-block"]`

#### `"after-comment"`

Ignore rules that come after a comment.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
/* comment */
a {}
```

#### `"first-nested"`

Ignore rules that are nested and the first child of their parent node.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
@media {
  a {}

  b {}
}
```

#### `"inside-block"`

Ignore rules that are inside a block.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
@media {
  a {}
}
```

```css
@media {
  a {}
  b {}
}
```
