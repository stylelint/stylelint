# comment-word-blacklist

Specify a blacklist of disallowed comments.

```css
    /* comment */
/**    ↑
 * These comments */
```

## Options

`array`: `"["array", "of", "unprefixed", "functions"]`

Given:

```js
["/todo/", "badword"]
```

The following patterns are considered warnings:

```css
/* todo */
```

```css
/* todo: add fallback */
```

```css
/* some todo */
```

The following patterns are *not* considered warnings:

```css
/* comments */
```
