# declaration-block-nesting-at-rule-required-list

Require specific at-rules to be present around CSS declarations.

<!-- prettier-ignore -->
```css
a { color: red; }
/**    ↑
 * This declaration */
```

## Options

`array|string|regex`: `["layer"]`

Given:

```json
["layer"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: red; }
```

<!-- prettier-ignore -->
```css
@media all {
  a { color: red; }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@layer {
  a { color: red; }
}
```

<!-- prettier-ignore -->
```css
a {
  @layer {
    color: red;
  }
}
```
