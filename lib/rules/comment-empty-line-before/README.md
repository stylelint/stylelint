# comment-empty-line-before

Require or disallow an empty line before comments.

```css
a {}
              /* ← */
/* comment */ /* ↑ */
/**              ↑
*        This line */
```

If the comment is the very first node in a stylesheet then it is ignored. Shared-line comments are also ignored.

If you're using a custom syntax which support single-line comments with `//`, those are ignored as well.

**Caveat:** Comments within *selector and value lists* are currently ignored.

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be an empty line before comments.

The following patterns are considered warnings:

```css
a {}
/* comment */
```

The following patterns are *not* considered warnings:

```css
a {}

/* comment */
```

```css
a {} /* comment */
```

### `"never"`

There *must never* be an empty line before comments.

The following patterns are considered warnings:

```css
a {}

/* comment */
```

The following patterns are *not* considered warnings:

```css
a {}
/* comment */
```

```css
a {} /* comment */
```

## Optional secondary options

### `except: ["first-nested"]`

Reverse the primary option for comments that are nested and the first child of their parent node.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {

  /* comment */
  color: pink;
}
```

The following patterns are *not* considered warnings:

```css
a {
  /* comment */
  color: pink;
}
```

### `ignore: ["after-comment", "stylelint-command"]`

#### `"after-comment"`

***Note: This option was previously called `between-comments`. See [the release planning docs](http://stylelint.io/user-guide/release-planning/) for details.***

Don't require an empty line after a comment.

For example, with `"always"`:

The following patterns are *not* considered warnings:

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

#### `"stylelint-command"`

***Note: This option was previously called `stylelint-commands`. See [the release planning docs](http://stylelint.io/user-guide/release-planning/) for details.***

Ignore comments that deliver commands to stylelint, e.g. `/* stylelint-disable color-no-hex */`.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {
  background: pink;
  /* not a stylelint command */
  color: #eee;
}
```

The following patterns are *not* considered warnings:

```css
a {
  background: pink;
  /* stylelint-disable color-no-hex */
  color: pink;
}
```
