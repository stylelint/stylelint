# function-disallowed-list

Specify a list of disallowed functions.

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
/**            ↑
 * This function */
```

## Options

### `Array<string>`

```json
["array", "of", "unprefixed", "functions", "/regex/"]
```

Given:

```json
{
  "function-disallowed-list": ["scale", "rgba", "/linear-gradient/"]
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
