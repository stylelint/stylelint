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

A string will be translated into a regular expression like `new RegExp(yourString)`, so make sure to escape it properly. Alternatively, a regular expression literal in JavaScript is available, such as `/yourPattern/`.

Given the string:

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
