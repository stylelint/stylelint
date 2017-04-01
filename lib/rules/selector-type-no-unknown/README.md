# selector-type-no-unknown

Disallow unknown type selectors.

```css
    unknown {}
/** ↑
 * This type selector */
```

This rule considers tags defined in the HTML and SVG Specifications to be known.

## Options

### `true`

The following patterns are considered warnings:

```css
unknown {}
```

```css
tag {}
```

The following patterns are *not* considered warnings:

```css
input {}
```

```css
ul li {}
```

```css
li > a {}
```

## Optional secondary options

### `ignore: ["default-namespace"]`

#### `"default-namespace"`

Allow unknown type selectors if they belong to the default namespace.

The following patterns are considered warnings:

```css
namespace|unknown {}
```

The following patterns are *not* considered warnings:

```css
unknown {}
```

### `ignoreNamespaces: ["/regex/", "string"]`

Given:

```js
["/^my-/", "custom-namespace"]
```

The following patterns are *not* considered warnings:

```css
custom-namespace|unknown {}
```

```css
my-namespace|unknown {}
```

```css
my-other-namespace|unknown {}
```

### `ignoreTypes: ["/regex/", "string"]`

Given:

```js
["/^my-/", "custom-type"]
```

The following patterns are *not* considered warnings:

```css
custom-type {}
```

```css
my-type {}
```

```css
my-other-type {}
```
