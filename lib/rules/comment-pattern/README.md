# comment-pattern

Specify a pattern for comments.

<!-- prettier-ignore -->
```css
/*  comment */
/** ↑
 * The pattern of this */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

Given:

```json
{
  "comment-pattern": "foo .+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
/*not starting with foo*/
a { color: red; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
/*foo at the beginning*/
a { color: red; }
```
