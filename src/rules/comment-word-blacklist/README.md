# comment-word-blacklist

Specify a blacklist of disallowed words within comments.

```css
 /* words within comments */
/** ↑     ↑      ↑
 * These three words */
```

## Options

`array`: `["array", "of", "words", "or", "/regex/" ]`

Given:

```js
["/^TODO:/", "badword"]
```

The following patterns are considered warnings:

```css
/* TODO: */
```

```css
/* TODO: add fallback */
```

```css
/* some badword */
```

The following patterns are *not* considered warnings:

```css
/* comment */
```
