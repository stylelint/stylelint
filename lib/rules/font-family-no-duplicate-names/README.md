# font-family-no-duplicate-names

Disallow duplicate names within font families.

<!-- prettier-ignore -->
```css
a { font-family: serif, serif; }
/**              ↑      ↑
 * These font family names */
```

This rule checks the `font` and `font-family` properties.

This rule ignores `$sass`, `@less`, and `var(--custom-property)` variable syntaxes.

> [!WARNING]
> This rule will stumble on _unquoted_ multi-word font names and _unquoted_ font names containing escape sequences. Wrap these font names in quotation marks, and everything should be fine.

## Options

### `true`

```json
{
  "font-family-no-duplicate-names": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { font-family: 'Times', Times, serif; }
```

<!-- prettier-ignore -->
```css
a { font: 1em "Arial", 'Arial', sans-serif; }
```

<!-- prettier-ignore -->
```css
a { font: normal 14px/32px -apple-system, BlinkMacSystemFont, sans-serif, sans-serif; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-family: Times, serif; }
```

<!-- prettier-ignore -->
```css
a { font: 1em "Arial", "sans-serif", sans-serif; }
```

<!-- prettier-ignore -->
```css
a { font: normal 14px/32px -apple-system, BlinkMacSystemFont, sans-serif; }
```

## Optional secondary options

### `ignoreFontFamilyNames`

```json
{ "ignoreFontFamilyNames": ["array", "of", "font-family-names", "/regex/"] }
```

Given:

```json
{
  "font-family-no-duplicate-names": [
    true,
    { "ignoreFontFamilyNames": ["/^My Font /", "monospace"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
font-family: monospace, monospace
```

<!-- prettier-ignore -->
```css
font-family: "My Font Family", "My Font Family", monospace
```
