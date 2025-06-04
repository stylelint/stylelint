# declaration-property-unit-allowed-list

Specify a list of allowed property and unit pairs within declarations.

<!-- prettier-ignore -->
```css
a { width: 100px; }
/** ↑         ↑
 * These properties and these units */
```

## Options

### `Object<string, Array<string>>`

```json
{ "unprefixed-property-name": ["array", "of", "units"] }
```

You can specify a regex for a property name, such as `{ "/^animation/": [] }`.

Given:

```json
{
  "declaration-property-unit-allowed-list": {
    "font-size": ["em", "px"],
    "/^animation/": ["s"],
    "line-height": []
  }
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

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"inside-function"`

Ignore units that are inside a function.

Given:

```json
{
  "declaration-property-unit-allowed-list": [
    {
      "/^border/": ["px"],
      "/^background/": ["%"]
    },
    {
      "ignore": ["inside-function"]
    }
  ]
}
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
