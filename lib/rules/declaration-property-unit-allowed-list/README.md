# declaration-property-unit-allowed-list

Specify a list of allowed property and unit pairs within declarations.

<!-- prettier-ignore -->
```css
a { width: 100px; }
/** ↑         ↑
 * These properties and these units */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`object`: `{ "unprefixed-property-name": ["array", "of", "units"]|"unit" }`

If a property name is surrounded with `"/"` (e.g. `"/^animation/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^animation/` will match `animation`, `animation-duration`, `animation-timing-function`, etc.

Given:

```json
{
  "font-size": ["em", "px"],
  "/^animation/": "s",
  "line-height": []
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { font-size: 1.2rem; }
```

<!-- prettier-ignore -->
```css
a { animation: animation-name 500ms ease; }
```

<!-- prettier-ignore -->
```css
a { -webkit-animation: animation-name 500ms ease; }
```

<!-- prettier-ignore -->
```css
a { animation-duration: 500ms; }
```

<!-- prettier-ignore -->
```css
a { line-height: 13px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-size: 1em; }
```

<!-- prettier-ignore -->
```css
a { height: 100px; }
```

<!-- prettier-ignore -->
```css
a { animation: animation-name 5s ease; }
```

<!-- prettier-ignore -->
```css
a { -webkit-animation: animation-name 5s ease; }
```

<!-- prettier-ignore -->
```css
a { animation-duration: 5s; }
```

<!-- prettier-ignore -->
```css
a { line-height: 1; }
```

## Optional secondary options

### `ignore: ["inside-function"]`

Ignore units that are inside a function.

For example, given:

```json
[
  {
    "/^border/": ["px"],
    "/^background/": ["%"]
  },
  {
    "ignore": ["inside-function"]
  }
]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  border: 1px solid hsla(162deg, 51%, 35%, 0.8);
}
```

<!-- prettier-ignore -->
```css
a {
  background-image: linear-gradient(hsla(162deg, 51%, 35%, 0.8), hsla(62deg, 51%, 35%, 0.8));
}
```
