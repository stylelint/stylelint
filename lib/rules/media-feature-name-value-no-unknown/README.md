# media-feature-name-value-no-unknown

Disallow unknown values for media features.

<!-- prettier-ignore -->
```css
@media (color: red) {}
/**     ↑      ↑
 * feature and value pairs like these */
```

This rule considers values for media features defined within the CSS specifications to be known.

This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as SCSS or Less.

It sometimes overlaps with:

- [`unit-no-unknown`](../unit-no-unknown/README.md)

If duplicate problems are flagged, you can turn off the corresponding rule.

## Options

### `true`

```json
{
  "media-feature-name-value-no-unknown": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (color: red) { top: 1px; }
```

<!-- prettier-ignore -->
```css
@media (width: 10) { top: 1px; }
```

<!-- prettier-ignore -->
```css
@media (width: auto) { top: 1px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (color: 8) { top: 1px; }
```

<!-- prettier-ignore -->
```css
@media (width: 10px) { top: 1px; }
```

### `ignoreMediaFeatureNameValues`

```json
{
  "ignoreMediaFeatureNameValues": {
    "media-feature-name": ["array", "of", "values", "/regex/"]
  }
}
```

Ignore the specified media feature name and value pairs. Keys in the object indicate media feature names.

`media-feature-name` must be a valid media feature name.

Given:

```json
{
  "media-feature-name-value-no-unknown": [
    true,
    {
      "ignoreMediaFeatureNameValues": {
        "display-mode": ["/^my-/", "custom"]
      }
    }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (display-mode: my-feature) {}
```

<!-- prettier-ignore -->
```css
@media (display-mode: custom) {}
```
