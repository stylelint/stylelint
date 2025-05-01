# comment-word-disallowed-list

Specify a list of disallowed words within comments.

<!-- prettier-ignore -->
```css
 /* words within comments */
/** ↑     ↑      ↑
 * These three words */
```

> [!WARNING]
> Comments within _selector and value lists_ are currently ignored.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

```json
["array", "of", "words", "/regex/"]
```

You can also specify a single word instead of an array of them.

If a string is surrounded with `"/"` (e.g. `"/^TODO:/"`), it is interpreted as a regular expression.

Given:

```json
{
  "comment-word-disallowed-list": ["/^TODO:/", "badword"]
}
```

The following patterns are considered problems:

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

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
/* comment */
```
