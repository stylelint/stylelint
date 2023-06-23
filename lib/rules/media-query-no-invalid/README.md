# media-query-no-invalid

Disallow invalid media queries.

<!-- prettier-ignore -->
```css
@media not(min-width: 300px) {}
/**    ↑
 * This media query */
```

Media queries must be grammatically valid according to the [Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/) specification.

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
