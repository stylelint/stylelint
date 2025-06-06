# at-rule-allowed-list

Specify a list of allowed at-rules.

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
  "at-rule-allowed-list": ["extend", "keyframes"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@import "path/to/file.css";
```

<!-- prettier-ignore -->
```css
@media screen and (max-width: 1024px) {
  a { display: none; }
}
```

The following patterns are _not_ considered problems:

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
@KEYFRAMES name {
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
