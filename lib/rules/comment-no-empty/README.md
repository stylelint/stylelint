# comment-no-empty

Disallow empty comments.

<!-- prettier-ignore -->
```css
    /* */
/** ↑
 * Comments like this */
```

This rule ignores SCSS-like comments.

> [!WARNING]
> Comments within _selector and value lists_ are currently ignored.

This rule doesn't have any [message arguments](../../../docs/user-guide/configure.md#message).

## Options

### `true`

```json
{
  "comment-no-empty": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
/**/
```

<!-- prettier-ignore -->
```css
/* */
```

<!-- prettier-ignore -->
```css
/*

 */
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
/* comment */
```

<!-- prettier-ignore -->
```css
/*
 * Multi-line Comment
**/
```
