# at-rule-disallowed-list

Specify a list of disallowed at-rules.

<!-- prettier-ignore -->
```css
    @keyframes name {}
/** ↑
 * At-rules like this */
```

This rule was previously called, and is aliased as, `at-rule-blacklist`.

## Options

`array|string`: `["array", "of", "unprefixed", "at-rules"]|"at-rule"`

Given:

```
["extend", "keyframes"]
```

The following patterns are considered violations:

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

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
@import "path/to/file.css";
```
