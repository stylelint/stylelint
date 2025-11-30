# selector-pseudo-class-disallowed-list

Specify a list of disallowed pseudo-class selectors.

<!-- prettier-ignore -->
```css
  a:hover {}
/** ↑
 * This pseudo-class selector */
```

This rule ignores selectors that use variable interpolation e.g. `:#{$variable} {}`.

## Options

### `Array<string>`

```json
["array", "of", "unprefixed", "pseudo-classes", "/regex/"]
```

Given:

```json
{
  "selector-pseudo-class-disallowed-list": ["hover", "/^nth-/"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:hover {}
```

<!-- prettier-ignore -->
```css
a:nth-of-type(5) {}
```

<!-- prettier-ignore -->
```css
a:nth-child(2) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:focus {}
```

<!-- prettier-ignore -->
```css
a:first-of-type {}
```
