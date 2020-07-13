# comment-word-disallowed-list

Specify a list of disallowed words within comments.

<!-- prettier-ignore -->
```css
 /* words within comments */
/** ↑     ↑      ↑
 * These three words */
```

This rule was previously called, and is aliased as, `comment-word-blacklist`.

**Caveat:** Comments within _selector and value lists_ are currently ignored.

## Options

`array|string|regexp`: `["array", "of", "words", /or/, "/regex/"]|"word"|"/regex/"`

If a string is surrounded with `"/"` (e.g. `"/^TODO:/"`), it is interpreted as a regular expression.

Given:

```
["/^TODO:/", "badword"]
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
/* TODO: */
```

<!-- prettier-ignore -->
```css
/* TODO: add fallback */
```

<!-- prettier-ignore -->
```css
/* some badword */
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
/* comment */
```
