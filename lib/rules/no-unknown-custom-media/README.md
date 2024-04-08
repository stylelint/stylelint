# no-unknown-custom-media

Disallow unknown custom media queries.

<!-- prettier-ignore -->
```css
@custom-media --sm (min-width: 40rem);
/**             ↑
*   This custom media query name */

@media (--sm) {}
/**      ↑
*   And this one */
```

This rule considers custom media queries defined within the same source to be known.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (--sm) {}

@media (--sm), (min-width: 40rem) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@custom-media --sm (min-width: 40rem);

@media (--sm) {}

@media (--sm), (min-width: 40rem) {}
```
