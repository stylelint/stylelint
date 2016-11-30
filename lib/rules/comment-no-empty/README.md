# comment-no-empty

Disallow empty comments.

```css
    /* */
/** ↑
 * Comments like this */
```

**Caveat:** Comments within *selector and value lists* are currently ignored.

## Options

### `true`

The following patterns are considered warnings:

```css
/**/
```

```css
/* */
```

```css
/*

 */
```

The following patterns are *not* considered warnings:

```css
/* comment */
```

```css
/*
 * Multi-line Comment
**/
```
