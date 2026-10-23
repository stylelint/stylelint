# no-invalid-position-var-function

Disallow `var()` functions in invalid positions.

<!-- prettier-ignore -->
```css
@font-face {
  font-weight: var(--weight);
/**            ↑
 * This var() function */
}
```

The `var()` function is only allowed in property values. This rule reports `var()` in selectors, property names, media queries, and descriptor values (such as those in `@font-face`, `@counter-style`, `@property`, and `@page`).

This rule does not report `var()` in ordinary property values, including page and margin box properties within `@page`.

> [!WARNING]
> This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as SCSS or Less.

This rule doesn't have any [message arguments](../../../docs/user-guide/configure.md#message).

## Options

### `true`

```json
{
  "no-invalid-position-var-function": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@font-face { font-weight: var(--weight); }
```

<!-- prettier-ignore -->
```css
@media (min-width: var(--width)) {}
```

<!-- prettier-ignore -->
```css
a:has(var(--selector)) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: var(--color); }
```

<!-- prettier-ignore -->
```css
@page { margin: var(--margin); }
```

This rule does not support automatic fixes.
