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

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the disallowed word.

## Options

### `Array<string>`

```json
["array", "of", "words", "/regex/"]
```

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
