# selector-pseudo-class-no-unknown

Disallow unknown pseudo-class selectors.

<!-- prettier-ignore -->
```css
  a:hover {}
/** ↑
 * This pseudo-class selector */
```

Use this rule to avoid mistyped pseudo-classes, e.g. `:hovr`. Browsers [ignore the whole rule](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Syntax/Error_handling#errors_in_selector_lists), as an unknown pseudo-class invalidates the selector.

This rule considers pseudo-class selectors defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

This rule ignores vendor-prefixed pseudo-class selectors.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the unknown pseudo-class.

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
