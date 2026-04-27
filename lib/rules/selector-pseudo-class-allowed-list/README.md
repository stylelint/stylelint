# selector-pseudo-class-allowed-list

Specify a list of allowed pseudo-class selectors.

<!-- prettier-ignore -->
```css
  a:hover {}
/** ↑
 * This pseudo-class selector */
```

This rule ignores selectors that use variable interpolation e.g. `:#{$variable} {}`.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the disallowed pseudo-class.

## Options

### `Array<string>`

```json
["array", "of", "pseudo-classes", "/regex/"]
```

Given:

```json
{
  "selector-pseudo-class-allowed-list": ["hover", "/^nth-/"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:focus {}
```

<!-- prettier-ignore -->
```css
a:first-of-type {}
```

The following patterns are _not_ considered problems:

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
