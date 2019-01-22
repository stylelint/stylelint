# comment-word-blacklist

Specify a blacklist of disallowed words within comments.

```css
 /* words within comments */
/** ↑     ↑      ↑
 * These three words */
```

This rule ignores comments within selector and value lists.

## 选项

`array|string|regexp`: `["array", "of", "words", /or/, "/regex/"]|"word"|"/regex/"`

If a string is surrounded with `"/"` (e.g. `"/^TODO:/"`), it is interpreted as a regular expression.

给定：

```js
["/^TODO:/", "badword"]
```

以下模式被视为违规：

```css
/* TODO: */
```

```css
/* TODO: add fallback */
```

```css
/* some badword */
```

以下模式*不*被视为违规：

```css
/* comment */
```
