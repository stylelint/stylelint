# unit-disallowed-list

Specify a list of disallowed units.

<!-- prettier-ignore -->
```css
a { width: 100px; }
/**           ↑
 *  These units */
```

## Options

### `Array<string>`

```json
["array", "of", "units"]
```

Given:

```json
{
  "unit-disallowed-list": ["px", "em", "deg"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { width: 100px; }
```

<!-- prettier-ignore -->
```css
a { font-size: 10em; }
```

<!-- prettier-ignore -->
```css
a { transform: rotate(30deg); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-size: 1.2rem; }
```

<!-- prettier-ignore -->
```css
a { line-height: 1.2; }
```

<!-- prettier-ignore -->
```css
a { height: 100vmin; }
```

<!-- prettier-ignore -->
```css
a { animation: animation-name 5s ease; }
```

## Optional secondary options

### `ignoreProperties`

```json
{ "ignoreProperties": { "unit": ["array", "of", "properties", "/regex/"] } }
```

Ignore units in the values of declarations with the specified properties.

Given:

```json
{
  "unit-disallowed-list": [
    ["px", "vmin"],
    {
      "ignoreProperties": {
        "px": ["font-size", "/^border/"],
        "vmin": "width"
      }
    }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-size: 13px; }
```

<!-- prettier-ignore -->
```css
a { border-bottom-width: 6px; }
```

<!-- prettier-ignore -->
```css
a { width: 100vmin; }
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { line-height: 12px; }
```

<!-- prettier-ignore -->
```css
a { -moz-border-radius-topright: 40px; }
```

<!-- prettier-ignore -->
```css
a { height: 100vmin; }
```

### `ignoreMediaFeatureNames`

```json
{
  "ignoreMediaFeatureNames": {
    "unit": ["array", "of", "feature-names", "/regex/"]
  }
}
```

Ignore units for specific feature names.

Given:

```json
{
  "unit-disallowed-list": [
    ["px", "dpi"],
    {
      "ignoreMediaFeatureNames": {
        "px": ["min-width", "/height$/"],
        "dpi": "resolution"
      }
    }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (min-width: 960px) {}
```

<!-- prettier-ignore -->
```css
@media (max-height: 280px) {}
```

<!-- prettier-ignore -->
```css
@media not (resolution: 300dpi) {}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (max-device-width: 500px) {}
```

<!-- prettier-ignore -->
```css
@media all and (min-width: 500px) and (max-width: 200px) {}
```

<!-- prettier-ignore -->
```css
@media print and (max-resolution: 100dpi) {}
```

### `ignoreFunctions`

```json
{ "ignoreFunctions": { "unit": ["array", "of", "functions", "/regex/"] } }
```

Ignore units that are inside of the specified functions.

Given:

```json
{
  "unit-disallowed-list": [
    ["px"],
    { "ignoreFunctions": ["calc", "/^translate/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin: calc(50% - 100px) }
```

<!-- prettier-ignore -->
```css
a { transform: translateX(100px) }
```
