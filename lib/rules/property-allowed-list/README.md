# property-allowed-list

Specify a list of allowed properties.

<!-- prettier-ignore -->
```css
a { display: block; }
/** ↑
 * This property */
```

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regex`: `["array", "of", /properties/, "regex"]|"property"|"/regex/"|/regex/`

If a string is surrounded with `"/"` (e.g. `"/^background/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^background/` will match `background`, `background-size`, `background-color`, etc.

Given:

```json
["display", "animation", "/^background/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a {
  animation: my-animation 2s;
  color: pink;
}
```

<!-- prettier-ignore -->
```css
a { borkgrund: orange; }
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
a { background: pink; }
```

<!-- prettier-ignore -->
```css
a { background-color: pink; }
```
