# at-rule-disallowed-list

Specify a list of disallowed at-rules.

<!-- prettier-ignore -->
```css
    @keyframes name {}
/** ↑
 * At-rules like this */
```

This rule ignores the `@charset` rule.

## Options

### `Array<string>`

```json
["array", "of", "unprefixed", "at-rules"]
```

Given:

```json
{
  "at-rule-disallowed-list": ["extend", "keyframes"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { @extend placeholder; }
```

<!-- prettier-ignore -->
```css
@keyframes name {
  from { top: 10px; }
  to { top: 20px; }
}
```

<!-- prettier-ignore -->
```css
@-moz-keyframes name {
  from { top: 10px; }
  to { top: 20px; }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import "path/to/file.css";
```
