# at-rule-whitelist

Specify a whitelist of allowed at-rules.

<!-- prettier-ignore -->
```css
    @keyframes name {}
/** ↑
 * At-rules like this */
```

## Options

`array|string`: `["array", "of", "unprefixed", "at-rules"]|"at-rule"`

Given:

```
["extend", "keyframes"]
```

The following patterns are considered violations:

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

The following patterns are _not_ considered violations:

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
