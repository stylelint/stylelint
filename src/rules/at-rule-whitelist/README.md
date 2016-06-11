# at-rule-whitelist

Specify a whitelist of allowed at-rules.

```css
    @keyframes name {}
/** ↑
 * At-rules like this */
```

## Options

`array`: `"["array", "of", "unprefixed", "at-rules"]`

Given:

```js
["extend", "keyframes"]
```

The following patterns are considered warnings:

```css
@import "path/to/file.css";
```

```css
@media screen and (max-width: 1024px) {
  ...
}
```

The following patterns are *not* considered warnings:

```css
a { @extend placeholder; }
```

```css
@keyframes name {
  from { top: 10px; }
  to { top: 20px; }
}
```

```css
@KEYFRAMES name {
  from { top: 10px; }
  to { top: 20px; }
}
```

```css
@-moz-keyframes name {
  from { top: 10px; }
  to { top: 20px; }
}
