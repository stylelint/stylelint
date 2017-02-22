# rule-empty-line-before

Require or disallow an empty line before rules.

```css
a {}
      /* ← */
b {}  /* ↑ */
/**      ↑
 * This line */
```

If the rule is the very first node in a stylesheet then it is ignored.

## Options

`string`: `"always"|"never"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be an empty line before rules.

The following patterns are considered warnings:

```css
a {} b {}
```

```css
a {}
b {}
```

The following patterns are *not* considered warnings:

```css
a {}

b {}
```

### `"never"`

There *must never* be an empty line before rules.

The following patterns are considered warnings:

```css
a {}

b {}
```

The following patterns are *not* considered warnings:

```css
a {} b {}
```

```css
a {}
b {}
```

### `"always-multi-line"`

There *must always* be an empty line before multi-line rules.

The following patterns are considered warnings:

```css
a {
  color: red;
}
b {
  color: blue;
}
```

The following patterns are *not* considered warnings:

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

The following patterns are considered warnings:

```css
a {
  color: red;
}

b {
  color: blue;
}
```

The following patterns are *not* considered warnings:

```css
a {
  color: red;
}
b {
  color: blue;
}
```

## Optional secondary options

### `except: ["after-rule", "after-single-line-comment", "inside-block-and-after-rule", "first-nested"]`

#### `"after-rule"`

Reverse the primary option if the rule comes after another rule.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {}

b {}
```

The following patterns are *not* considered warnings:

```css
a {}
b {}
```

#### `"after-single-line-comment"`

Reverse the primary option if the rule comes after a single-line comment.

For example, with `"always"`:

The following patterns are considered warnings:

```css
/* comment */

a {}
```

The following patterns are *not* considered warnings:

```css
/* comment */
a {}
```

#### `"inside-block-and-after-rule"`

Reverse the primary option if the rule is inside a block and comes after another rule.

For example, with `"always"`:

The following patterns are considered warnings:

```css
@media {

  a {}

  b {}
}
```

The following patterns are *not* considered warnings:

```css
@media {
  a {}
  b {}
}
```

#### `"first-nested"`

Reverse the primary option if the rule is the first in a block.

For example, with `"always"`:

The following patterns are considered warnings:

```css
@media {

  a {}

  b {}
}
```

The following patterns are *not* considered warnings:

```css
@media {
  a {}

  b {}
}
```

### `ignore: ["after-comment", "inside-block"]`

#### `"after-comment"`

Ignore rules that come after a comment.

For example, with `"always"`:

The following patterns are *not* considered warnings:

```css
/* comment */
a {}
```

#### `"inside-block"`

Ignore rules that are inside a block.

For example, with `"always"`:

The following patterns are *not* considered warnings:

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
