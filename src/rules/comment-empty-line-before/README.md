# comment-empty-line-before

Require or disallow an empty line before comments.

```css
    a {}
                  /* ← */
    /* comment */ /* ↑ */
/**                  ↑
 *           This line */
```

If the comment is the very first node in a stylesheet then it is ignored. Inline comments are also ignored.

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

There *must never* be an empty before comments.

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
