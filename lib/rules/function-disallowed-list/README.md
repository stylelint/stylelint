# function-disallowed-list

Specify a list of disallowed functions.

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
/**            ↑
 * This function */
```

You can use this rule to enforce a convention. For example, disallow `rgb` and `hsl` in favor of `oklch`, so that all colors use one color space.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the disallowed function.

## Options

### `Array<string>`

```json
["array", "of", "functions", "/regex/"]
```

Given:

```json
{
  "function-disallowed-list": ["scale", "rgba", "/^(-moz-)?linear-gradient$/"]
}
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
