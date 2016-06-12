# comment-word-blacklist

Specify a blacklist of disallowed words within comments.

```css
 /* words within comments */
/** ↑     ↑      ↑
 * These three words */
```

## Options

`array|string`: `["array", "of", "words", "or", "/regex/"]|"word"|"/regex/"`

If a string is surrounded with `"/"` (e.g. `"/^TODO:/"`), it is interpreted as a regular expression.

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
