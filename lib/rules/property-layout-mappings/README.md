# property-layout-mappings

Require either physical or logical layout mappings in CSS.

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
/**   ↑
 * This physical property should be logical */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"logical"` or `"physical"`

Given:

```json
{
  "property-layout-mappings": "logical"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
```

<!-- prettier-ignore -->
```css
a { width: 200px; }
```

<!-- prettier-ignore -->
```css
a { border-top-left-radius: 5px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 10px; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 200px; }
```

<!-- prettier-ignore -->
```css
a { border-start-start-radius: 5px; }
```

Given:

```json
{
  "property-layout-mappings": "physical"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 10px; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 200px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
```

<!-- prettier-ignore -->
```css
a { width: 200px; }
```

## Optional secondary options

### `exceptProperties`

```json
{ "exceptProperties": ["array", "of", "properties", "/regex/"] }
```

Given:

```json
{
  "property-layout-mappings": [
    "logical",
    { "exceptProperties": ["margin-left", "width"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
```

<!-- prettier-ignore -->
```css
a { width: 200px; }
```
