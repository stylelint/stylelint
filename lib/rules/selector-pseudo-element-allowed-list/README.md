# selector-pseudo-element-allowed-list

Specify a list of allowed pseudo-element selectors.

<!-- prettier-ignore -->
```css
  a::before {}
/**  ↑
 * This pseudo-element selector */
```

This rule ignores:

- CSS2 pseudo-elements i.e. those prefixed with a single colon
- selectors that use variable interpolation e.g. `::#{$variable} {}`

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regex`: `["array", "of", "unprefixed", /pseudo-elements/, "/regex/"]|"pseudo-element"|"/regex/"|/regex/`

Given:

```json
["before", "/^--my-/i"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a::after {}
```

<!-- prettier-ignore -->
```css
a::--not-my-pseudo-element {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a::before {}
```

<!-- prettier-ignore -->
```css
a::--my-pseudo-element {}
```

<!-- prettier-ignore -->
```css
a::--MY-OTHER-pseudo-element {}
```
