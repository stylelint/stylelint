# comment-space-inside

Require a single space or disallow whitespace on the inside of comment markers.

```css
    /* comment */
/**  ↑         ↑
 * The space inside these two markers */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space inside the markers.

The following patterns are considered warnings:

```css
/*comment*/
```

```css
/*comment */
```

```css
/* comment*/
```

The following patterns are *not* considered warnings:

```css
/* comment */
```

### `"never"`

There *must never* be whitespace on the inside the markers.

The following patterns are considered warnings:

```css
/* comment */
```

```css
/*comment */
```

```css
/* comment*/
```

The following patterns are *not* considered warnings:

```css
/*comment*/
```
