# selector-pseudo-class-no-unknown

Disallow unknown pseudo-class selectors.

<!-- prettier-ignore -->
```css
  a:hover {}
/** ↑
 * This pseudo-class selector */
```

This rule considers pseudo-class selectors defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

This rule ignores vendor-prefixed pseudo-class selectors.

## Options

### `true`

```json
{
  "selector-pseudo-class-no-unknown": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:unknown {}
```

<!-- prettier-ignore -->
```css
a:UNKNOWN {}
```

<!-- prettier-ignore -->
```css
a:hoverr {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:hover {}
```

<!-- prettier-ignore -->
```css
a:focus {}
```

<!-- prettier-ignore -->
```css
:not(p) {}
```

<!-- prettier-ignore -->
```css
input:-moz-placeholder {}
```

## Optional secondary options

### `ignorePseudoClasses`

```json
{ "ignorePseudoClasses": ["array", "of", "pseudo-classes", "/regex/"] }
```

Given:

```json
{
  "selector-pseudo-class-no-unknown": [
    true,
    { "ignorePseudoClasses": ["/^--my-/", "--pseudo-class"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:--my-pseudo {}
```

<!-- prettier-ignore -->
```css
a:--my-other-pseudo {}
```

<!-- prettier-ignore -->
```css
a:--pseudo-class {}
```
