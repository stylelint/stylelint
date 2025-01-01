# property-allowed-list

Specify a list of allowed properties.

<!-- prettier-ignore -->
```css
a { color: red; }
/** ↑
 * This property */
```

This rule ignores preprocessor variables (e.g. `$sass`, `@less`).

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regex`: `["array", "of", /properties/, "regex"]|"property"|"/regex/"|/regex/`

If a string is surrounded with `"/"` (e.g. `"/^background/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^background/` will match `background`, `background-size`, `background-color`, etc.

Given:

```json
["display", "animation", "/^background/", "--foo"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: red; }
```

<!-- prettier-ignore -->
```css
a {
  animation: my-animation 2s;
  color: red;
}
```

<!-- prettier-ignore -->
```css
a { borkgrund: orange; }
```

<!-- prettier-ignore -->
```css
a { --bar: red; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { display: block; }
```

<!-- prettier-ignore -->
```css
a { -webkit-animation: my-animation 2s; }
```

<!-- prettier-ignore -->
```css
a {
  animation: my-animation 2s;
  -webkit-animation: my-animation 2s;
  display: block;
}
```

<!-- prettier-ignore -->
```css
a { background: red; }
```

<!-- prettier-ignore -->
```css
a { background-color: red; }
```

<!-- prettier-ignore -->
```css
a { --foo: red; }
```
