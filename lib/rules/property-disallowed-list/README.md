# property-disallowed-list

Specify a list of disallowed properties.

<!-- prettier-ignore -->
```css
a { text-rendering: optimizeLegibility; }
/** ↑
 * This property */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regex`: `["array", "of", /properties/, "regex"]|"property"|"/regex/"|/regex/`

If a string is surrounded with `"/"` (e.g. `"/^background/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^background/` will match `background`, `background-size`, `background-color`, etc.

Given:

```json
["text-rendering", "animation", "/^background/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { text-rendering: optimizeLegibility; }
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
a { -webkit-animation: my-animation 2s; }
```

<!-- prettier-ignore -->
```css
a { background: pink; }
```

<!-- prettier-ignore -->
```css
a { background-size: cover; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a { no-background: sure; }
```
