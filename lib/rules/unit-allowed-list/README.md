# unit-allowed-list

Specify a list of allowed units.

<!-- prettier-ignore -->
```css
a { width: 100px; }
/**           ↑
 *  These units */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string`: `["array", "of", "units"]|"unit"`

Given:

```json
["px", "em", "deg"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { width: 100%; }
```

<!-- prettier-ignore -->
```css
a { font-size: 10rem; }
```

<!-- prettier-ignore -->
```css
a { animation: animation-name 5s ease; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-size: 1.2em; }
```

<!-- prettier-ignore -->
```css
a { line-height: 1.2; }
```

<!-- prettier-ignore -->
```css
a { height: 100px; }
```

<!-- prettier-ignore -->
```css
a { height: 100PX; }
```

<!-- prettier-ignore -->
```css
a { transform: rotate(30deg); }
```

## Optional secondary options

### `ignoreProperties: { "unit": ["property", "/regex/", /regex/]|"property"|"/regex/"|/regex/ }`

Ignore units in the values of declarations with the specified properties.

For example, with `["px", "em"]`.

Given:

```json
{
  "rem": ["line-height", "/^border/"],
  "%": ["width"]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { line-height: 0.1rem; }
```

<!-- prettier-ignore -->
```css
a { border-bottom-width: 6rem; }
```

<!-- prettier-ignore -->
```css
a { width: 100%; }
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin: 0 20rem; }
```

<!-- prettier-ignore -->
```css
a { -moz-border-radius-topright: 20rem; }
```

<!-- prettier-ignore -->
```css
a { height: 100%; }
```

### `ignoreFunctions: ["function", "/regex/", /regex/]|"function"|"/regex/"|/regex/`

Ignore units that are inside of the specified functions.

For example, with `["px", "em"]`.

Given:

```json
["/^hsl/", "calc"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  border: 1px solid hsl(162deg, 51%, 35%, 0.8);
}
```

<!-- prettier-ignore -->
```css
a {
  background-image: linear-gradient(hsla(162deg, 51%, 35%, 0.8), hsla(62deg, 51%, 35%, 0.8));
}
```

<!-- prettier-ignore -->
```css
a {
  width: calc(100% - 10px);
}
```
