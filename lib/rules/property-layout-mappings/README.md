# property-layout-mappings

Enforce either physical or flow-relative layout mappings in CSS.

<!-- prettier-ignore -->
```css
a { margin-left: 10px; }
/** ↑
 * This property */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix problems reported by this rule when the primary option is `"flow-relative"` and `languageOptions.directionality` is configured.

## Language Options

This rule supports the [`languageOptions.directionality`](../../../docs/user-guide/configure.md#languageoptions) configuration to enable safe autofixing for flow-relative properties.

```json
{
  "languageOptions": {
    "directionality": {
      "block": "top-to-bottom",
      "inline": "left-to-right"
    }
  },
  "rules": {
    "property-layout-mappings": "flow-relative"
  }
}
```

**Note**: Without `languageOptions.directionality` configuration, the rule will report problems but not autofix them to prevent unintended layout changes.

## Options

### `"flow-relative"`

Given:

```json
{
  "property-layout-mappings": "flow-relative"
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

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin-inline-start: 10px; }
```

<!-- prettier-ignore -->
```css
a { inline-size: 200px; }
```

### `"physical"`

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

Reverse the primary option for matching properties.

```json
{ "exceptProperties": ["array", "of", "properties", "/regex/"] }
```

Given:

```json
{
  "property-layout-mappings": [
    "flow-relative",
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

### `dir`

```json
{ "dir": "ltr" | "rtl" | "auto" }
```

Specify the writing direction context. This option helps provide better warnings about logical property usage but does not change the rule's behavior.

- `"ltr"` (default) - Left-to-right writing direction
- `"rtl"` - Right-to-left writing direction
- `"auto"` - Direction determined by content

Given:

```json
{
  "property-layout-mappings": ["flow-relative", { "dir": "rtl" }]
}
```

This provides context that the code will be used in a right-to-left writing environment.
