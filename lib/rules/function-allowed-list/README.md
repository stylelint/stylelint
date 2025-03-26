# function-allowed-list

Specify a list of allowed functions.

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
/**            ↑
 * This function */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regex`: `["array", "of", "unprefixed", /functions/, "/regex/"]|"function"|"/regex/"|/regex/`

If a string is surrounded with `"/"` (e.g. `"/^rgb/"`), it is interpreted as a regular expression.

Given:

```json
["scale", "rgba", "/linear-gradient/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: rotate(1); }
```

<!-- prettier-ignore -->
```css
a {
  color: hsla(170, 50%, 45%, 1)
}
```

<!-- prettier-ignore -->
```css
a {
  background:
    red,
    -webkit-radial-gradient(red, green, blue);
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { background: red; }
```

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

## Optional secondary options

### `exceptWithoutPropertyFallback`: `["array", "of", "unprefixed", /functions/, "/regex/"]|"function"|"/regex/"|/regex/`

Requires specified functions to have a fallback property declaration before them within the same selector.
The function must be included in the primary option list to be affected by this option.

Given:

```json
["min", "/max/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { width: min(50%, 100px);}
```

<!-- prettier-ignore -->
```css
a { height: max(50%, 100px); }
```

<!-- prettier-ignore -->
```css
a {
  width: max(50%, 100px);
  width: 100px;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 100px;
  width: min(50%, 100px);
}
```
