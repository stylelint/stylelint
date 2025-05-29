# function-allowed-list

Specify a list of allowed functions.

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
  "function-allowed-list": ["scale", "rgba", "/linear-gradient/"]
}
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

### `exceptWithoutPropertyFallback`

```json
{
  "exceptWithoutPropertyFallback": [
    "array",
    "of",
    "unprefixed",
    "functions",
    "/regex/"
  ]
}
```

Disallow the matching functions when they are without a property fallback in the same declaration block.

Given:

```json
{
  "function-allowed-list": [
    ["scale", "min", "/max/"],
    { "exceptWithoutPropertyFallback": ["min", "/max/"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { width: min(50%, 100px); }
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
a { transform: scale(1); }
```

<!-- prettier-ignore -->
```css
a {
  width: 100px;
  width: min(50%, 100px);
}
```
