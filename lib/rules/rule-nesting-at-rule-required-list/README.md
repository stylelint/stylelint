# rule-nesting-at-rule-required-list

Require rules to be nested in specific at-rules.

<!-- prettier-ignore -->
```css
a { color: red; }
/** ↑
 * This rule */
```

## Options

### `Array<string | RegExp>`

Given:

```json
{
  "rule-nesting-at-rule-required-list": ["layer", "/^--foo-/"]
}
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

<!-- prettier-ignore -->
```css
a {
  @layer {
    color: red;
  }
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
@--foo-bar {
  a { color: red; }
}
```

<!-- prettier-ignore -->
```css
@--foo-baz {
  a { color: red; }
}
```

<!-- prettier-ignore -->
```css
@font-face {
  font-family: "foo";
}
```
