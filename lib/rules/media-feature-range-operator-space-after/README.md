# media-feature-range-operator-space-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace after the range operator in media features.

<!-- prettier-ignore -->
```css
@media (width >= 600px) {}
/**           ↑
 * The space after this operator */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be a single space after the range operator.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (width>=600px) {}
```

<!-- prettier-ignore -->
```css
@media (width >=600px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (width>= 600px) {}
```

<!-- prettier-ignore -->
```css
@media (width >= 600px) {}
```

### `"never"`

There _must never_ be whitespace after the range operator.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (width>= 600px) {}
```

<!-- prettier-ignore -->
```css
@media (width >= 600px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (width>=600px) {}
```

<!-- prettier-ignore -->
```css
@media (width >=600px) {}
```