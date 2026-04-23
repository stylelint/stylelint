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

This rule considers custom media queries defined within the same source or within the files specified in the [`referenceFiles`](../../../docs/user-guide/configure.md#referencefiles) configuration property to be known.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the unknown custom media name.

## Options

### `true`

```json
{
  "no-unknown-custom-media": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (--sm) {}

@media (--sm), (max-height: 40rem) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@custom-media --sm (min-width: 40rem);

@media (--sm), (max-height: 40rem) {}
```

> [!NOTE]
> The `@custom-media` name can be used before its declaration

<!-- prettier-ignore -->
```css
@media (--lg) {}

@custom-media --lg (min-width: 60rem);
```
