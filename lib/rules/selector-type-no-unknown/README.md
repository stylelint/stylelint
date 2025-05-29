# selector-type-no-unknown

Disallow unknown type selectors.

<!-- prettier-ignore -->
```css
    unknown {}
/** ↑
 * This type selector */
```

This rule considers tags defined in the HTML, SVG, and MathML specifications to be known.

## Options

### `true`

```json
{
  "selector-type-no-unknown": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
unknown {}
```

<!-- prettier-ignore -->
```css
tag {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
input {}
```

<!-- prettier-ignore -->
```css
ul li {}
```

<!-- prettier-ignore -->
```css
li > a {}
```

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"custom-elements"`

Allow custom elements.

```json
{
  "selector-type-no-unknown": [true, { "ignore": ["custom-elements"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
unknown {}
```

<!-- prettier-ignore -->
```css
x-Foo {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
x-foo {}
```

#### `"default-namespace"`

Allow unknown type selectors if they belong to the default namespace.

```json
{
  "selector-type-no-unknown": [true, { "ignore": ["default-namespace"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
namespace|unknown {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
unknown {}
```

### `ignoreNamespaces`

```json
{ "ignoreNamespaces": ["array", "of", "namespaces", "/regex/"] }
```

Given:

```json
{
  "selector-type-no-unknown": [
    true,
    { "ignoreNamespaces": ["/^my-/", "custom-namespace"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
custom-namespace|unknown {}
```

<!-- prettier-ignore -->
```css
my-namespace|unknown {}
```

<!-- prettier-ignore -->
```css
my-other-namespace|unknown {}
```

### `ignoreTypes`

```json
{ "ignoreTypes": ["array", "of", "types", "/regex/"] }
```

Given:

```json
{
  "selector-type-no-unknown": [
    true,
    { "ignoreTypes": ["/^my-/", "custom-type"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
custom-type {}
```

<!-- prettier-ignore -->
```css
my-type {}
```

<!-- prettier-ignore -->
```css
my-other-type {}
```
