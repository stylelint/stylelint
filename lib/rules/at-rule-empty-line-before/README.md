# at-rule-empty-line-before

Require or disallow an empty line before at-rules.

```css
a {}
          /* ← */
@media {} /* ↑ */
/**          ↑
 *   This line */
```

This rule ignores:

-   at-rules that are the very first node in the source
-   `@import` in Less.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。我们建议启用 [`indentation`](../indentation/README.md) 规则，以便更好地使用此规则自动修复结果。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be an empty line before at-rules.

以下模式被视为违规：

```css
a {} @media {}
```

```css
a {}
@media {}
```

以下模式*不*被视为违规：

```css
a {}

@media {}
```

### `"never"`

There *must never* be an empty line before at-rules.

以下模式被视为违规：

```css
a {}

@media {}
```

以下模式*不*被视为违规：

```css
a {} @media {}
```

```css
a {}
@media {}
```

## 可选的辅助选项

### `except: ["after-same-name", "inside-block", "blockless-after-same-name-blockless", "blockless-after-blockless", "first-nested"]`

#### `"after-same-name"`

Reverse the primary option for at-rules that follow another at-rule with the same name.

This means that you can group your at-rules by name.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
@charset "UTF-8";

@import url(x.css);
@import url(y.css);

@media (min-width: 100px) {}
@media (min-width: 200px) {}
```

```css
a {

  @extends .foo;
  @extends .bar;

  @include x;
  @include y {}
}
```

#### `"inside-block"`

Reverse the primary option for at-rules that are nested.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {

  @extend foo;
  color: pink;
}

b {
  color: pink;

  @extend foo;
}
```

以下模式*不*被视为违规：

```css
a {
  @extend foo;
  color: pink;
}

b {
  color: pink;
  @extend foo;
}
```

#### `"blockless-after-same-name-blockless"`

Reverse the primary option for blockless at-rules that follow another blockless at-rule with the same name.

This means that you can group your blockless at-rules by name.

Shared-line comments do not affect this option.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
@charset "UTF-8";

@import url(x.css);
@import url(y.css);
```

```css
@charset "UTF-8";

@import url(x.css); /* comment */
@import url(y.css);
```

```css
a {

  @extends .foo;
  @extends .bar;

  @include loop;
  @include doo;
}
```

#### `"blockless-after-blockless"`

Reverse the primary option for at-rules within a blockless group.

Shared-line comments do not affect this option.

例如，使用 `"always"`：

以下模式被视为违规：

```css
@import url(x.css);

@import url(y.css);

@media print {}
```

以下模式*不*被视为违规：

```css
@import url(x.css);
@import url(y.css);

@media print {}
```

```css
@import url(x.css); /* comment */
@import url(y.css);

@media print {}
```

#### `"first-nested"`

Reverse the primary option for at-rules that are nested and the first child of their parent node.

例如，使用 `"always"`：

以下模式被视为违规：

```css
a {

  @extend foo;
  color: pink;
}

b {
  color: pink;
  @extend foo;
}
```

以下模式*不*被视为违规：

```css
a {
  @extend foo;
  color: pink;
}

b {
  color: pink;

  @extend foo;
}
```

### `ignore: ["after-comment", "first-nested", "inside-block", "blockless-after-same-name-blockless", "blockless-after-blockless"]`

#### `"after-comment"`

Ignore at-rules that come after a comment.

Shared-line comments do not trigger this option.

以下模式*不*被视为违规：

```css
/* comment */
@media {}
```

```css
/* comment */

@media {}
```

```css
@media {} /* comment */

@media {}
```

#### `"first-nested"`

Ignore at-rules that are nested and the first child of their parent node.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
@supports {
  @media {}

  @media {}
}
```

#### `"inside-block"`

Ignore at-rules that are inside a declaration block.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
a {
  @extend foo;
  color: pink;
}

a {

  @extend foo;
  color: pink;
}

b {
  color: pink;
  @extend foo;
}

b {
  color: pink;

  @extend foo;
}
```

#### `"blockless-after-same-name-blockless"`

Ignore blockless at-rules that follow another blockless at-rule with the same name.

This means that you can group your blockless at-rules by name.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css

@charset "UTF-8";

@import url(x.css);
@import url(y.css);
```

```css
a {

  @extends .foo;
  @extends .bar;

  @include loop;
  @include doo;
}
```

#### `"blockless-after-blockless"`

Ignore blockless at-rules that follow another blockless at-rule.

例如，使用 `"always"`：

以下模式*不*被视为违规：

```css
@import url(x.css);

@import url(y.css);

@media print {}
```

```css
@import url(x.css);
@import url(y.css);

@media print {}
```

### `ignoreAtRules: ["array", "of", "at-rules"]`

Ignore specified at-rules.

For example, with `"always"`.

给定：

```js
["import"]
```

以下模式*不*被视为违规：

```css
@charset "UTF-8";
@import {}
```
