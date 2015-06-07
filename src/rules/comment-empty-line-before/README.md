# comment-empty-line-before

Require or disallow an empty line before comments.

```css
    a {}
                  /* ← */
    /* comment */ /* ↑ */
/**                  ↑  
 *           This line */
```

## Options

`string`: `"always"|"never"|"always-except-inline"`

### `"always"`

There *must always* be an empty line before @rules.

The following patterns are considered warnings:

```css
a {} /* comment */
```

```css
a {}
/* comment */
```

The following patterns are *not* considered warnings:

```css
a {}

/* comment */
```

### `"always-except-inlines"`

There *must always* be an empty line before @rules, except when the comment is inline.

The following patterns are considered warnings:


```css
a {}
/* comment */
```

The following patterns are *not* considered warnings:

```css
a {} /* comment */
```

```css
a {}

/* comment */
```

### `"never"`

There *must never* be an empty before @rules.

The following patterns are considered warnings:

```css
a {}

/* comment */
```

The following patterns are *not* considered warnings:

```css
a {} /* comment */
```

```css
a {} 
/* comment */
```
