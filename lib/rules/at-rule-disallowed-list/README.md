# at-rule-disallowed-list

Specify a list of disallowed at-rules.

<!-- prettier-ignore -->
```css
    @keyframes name {}
/** ↑
 * At-rules like this */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string`: `["array", "of", "unprefixed", "at-rules"]|"at-rule"`

Given:

```json
["extend", "keyframes"]
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
