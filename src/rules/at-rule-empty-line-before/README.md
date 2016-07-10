# at-rule-empty-line-before

Require or disallow an empty line before at-rules.

```css
a {}
          /* ← */
@media {} /* ↑ */
/**          ↑
 *   This line */
```

If the at-rule is the very first node in a stylesheet then it is ignored.

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be an empty line before at-rules.

The following patterns are considered warnings:

```css
a {} @media {}
```

```css
a {}
@media {}
```

The following patterns are *not* considered warnings:

```css
a {}

@media {}
```

### `"never"`

There *must never* be an empty line before at-rules.

The following patterns are considered warnings:

```css
a {}

@media {}
```

The following patterns are *not* considered warnings:

```css
a {} @media {}
```

```css
a {}
@media {}
```

## Optional options

### `except: ["all-nested", "blockless-group", "first-nested"]`

### `"all-nested"`

Reverse the primary option for at-rules that are nested.

For example, with `"always"`:

The following patterns are considered warnings:

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

The following patterns are *not* considered warnings:

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

#### `"blockless-group"`

Reverse the primary option for at-rules within a blockless group.

For example, with `"always"`:

The following patterns are considered warnings:

```css
@import url(x.css);

@import url(y.css);

@media print {}
```

The following patterns are *not* considered warnings:

```css
@import url(x.css);
@import url(y.css);

@media print {}
```

#### `"first-nested"`

Reverse the primary option for at-rules that are nested and the first child of their parent node.

For example, with `"always"`:

The following patterns are considered warnings:

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

The following patterns are *not* considered warnings:

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

### `ignore: ["after-comment", "blockless-group", "all-nested"]`

#### `"after-comment"`

Ignore at-rules that come after a comment.

The following patterns are *not* considered warnings:

```css
/* comment */
@media {}
```

```css
/* comment */

@media {}
```

#### `"all-nested"`

Ignore at-rules that are nested.

For example, with `"always"`:

The following patterns are *not* considered warnings:

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

#### `"blockless-group"`

Ignore at-rules within a blockless group.

For example, with `"always"`:

The following patterns are *not* considered warnings:

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

Given:

```js
["import"]
```

The following patterns are *not* considered warnings:

```css
@charset "UTF-8";
@import {}
```
