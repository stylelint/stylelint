# function-disallowed-list

Specify a list of disallowed functions.

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
/**            ↑
 * This function */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regex`: `["array", "of", "unprefixed", /functions/, "regex"]|"function"|"/regex/"|/regex/`

If a string is surrounded with `"/"` (e.g. `"/^rgb/"`), it is interpreted as a regular expression.

Given:

```json
["scale", "rgba", "linear-gradient"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
```

<!-- prettier-ignore -->
```css
a {
  color: rgba(0, 0, 0, 0.5);
}
```

<!-- prettier-ignore -->
```css
a {
  background:
    red,
    -moz-linear-gradient(45deg, blue, red);
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { background: red; }
```
