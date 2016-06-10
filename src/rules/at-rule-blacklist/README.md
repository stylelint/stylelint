# at-rule-blacklist

Specify a blacklist of disallowed at-rules.

```scss
      @keyframes name {
/**   ↑
 *    Rules like this */
```

## Options

`array`: `"["array", "of", "unprefixed", "at-rules"]`

The rule's search is case insensitive, and it also takes vendor prefixes into account.

Given:

```js
["extend", "keyframes"]
```

The following patterns are considered warnings:

```scss
a { @extend placeholder; }
```

```scss
@keyframes name {
  from { top: 10px; }
  to { top: 20px; }
}
```

```scss
@-moz-keyframes name {
  from { top: 10px; }
  to { top: 20px; }
}
```

The following patterns are *not* considered warnings:

```scss
@mixin name ($p) {
  ...
}
```
