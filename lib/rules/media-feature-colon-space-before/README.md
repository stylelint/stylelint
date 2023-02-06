# media-feature-colon-space-before

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace before the colon in media features.

<!-- prettier-ignore -->
```css
@media (max-width :600px) {}
/**               ↑
 * The space before this colon */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be a single space before the colon.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (max-width:600px) {}
```

<!-- prettier-ignore -->
```css
@media (max-width: 600px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (max-width :600px) {}
```

<!-- prettier-ignore -->
```css
@media (max-width : 600px) {}
```

### `"never"`

There _must never_ be whitespace before the colon.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (max-width :600px) {}
```

<!-- prettier-ignore -->
```css
@media (max-width : 600px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (max-width:600px) {}
```

<!-- prettier-ignore -->
```css
@media (max-width: 600px) {}
```
