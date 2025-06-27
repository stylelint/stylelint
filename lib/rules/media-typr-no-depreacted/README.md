```markdown
# media-type-no-deprecated

Disallow deprecated media types.

<!-- prettier-ignore -->
```css
@media tty {}
/**      ↑
 * These deprecated media types */
```

## Description

This rule disallows media types that have been removed from CSS specifications. Modern browsers no longer support these deprecated types, and they should be replaced with modern media features.

## Options

### `true`

Enables the rule with default settings.

```json
{
  "media-type-no-deprecated": true
}
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
@media tty {}
```

<!-- prettier-ignore -->
```css
@media speech and (min-width: 100px) {}
```

The following patterns are not considered violations:

<!-- prettier-ignore -->
```css
@media screen {}
```

<!-- prettier-ignore -->
```css
@media (min-width: 100px) {}
```

### `ignoreMediaTypes`

```json
{
  "media-type-no-deprecated": [true, {
    "ignoreMediaTypes": ["array", "of", "types", "/regex/"]
  }]
}
```

Example configuration:

```json
{
  "media-type-no-deprecated": [true, {
    "ignoreMediaTypes": ["speech", "/^tv$/"]
  }]
}
```

With this configuration, the following patterns are not considered violations:

<!-- prettier-ignore -->
```css
@media speech {}
```

<!-- prettier-ignore -->
```css
@media TV and (color) {}
```

## Deprecated Media Types

The rule checks for these deprecated media types:
- `tty` (teletype terminals)
- `tv` (television-type devices)
- `projection` (projectors)
- `handheld` (handheld devices)
- `braille` (braille tactile devices)
- `embossed` (braille printers)
- `aural` (speech synthesizers, deprecated in favor of `speech`)
- `speech` (speech synthesizers)

## Fixing

This rule is automatically fixable. The deprecated media types will be removed while preserving other conditions:

```css
/* Before */
@media only speech and (color) {}

/* After */
@media only and (color) {}
```

```css
/* Before */
@media not tty and (orientation: portrait) {}

/* After */
@media not and (orientation: portrait) {}
```

## When Not To Use It

1. If you need to support legacy browsers that relied on these media types
2. If you're working with unmodifiable legacy code
3. In specialized environments that still require these media types
