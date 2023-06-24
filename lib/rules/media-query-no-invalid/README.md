# media-query-no-invalid

Disallow invalid media queries.

<!-- prettier-ignore -->
```css
@media not(min-width: 300px) {}
/**    ↑
 * This media query */
```

Media queries must be grammatically valid according to the [Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/) specification.

This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as Sass or Less, as they have their own syntaxes.

It works well with other rules that validate feature names and values:

- [`media-feature-name-no-unknown`](../media-feature-name-no-unknown/README.md)
- [`media-feature-name-value-no-unknown`](../media-feature-name-value-no-unknown/README.md)

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media not(min-width: 300px) {}
```

<!-- prettier-ignore -->
```css
@media (width == 100px) {}
```

<!-- prettier-ignore -->
```css
@media (color) and (hover) or (width) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media not (min-width: 300px) {}
```

<!-- prettier-ignore -->
```css
@media (width = 100px) {}
```

<!-- prettier-ignore -->
```css
@media ((color) and (hover)) or (width) {}
```

<!-- prettier-ignore -->
```css
@media (color) and ((hover) or (width)) {}
```
