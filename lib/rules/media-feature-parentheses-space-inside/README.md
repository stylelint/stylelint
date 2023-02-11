# media-feature-parentheses-space-inside

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace on the inside of the parentheses within media features.

<!-- prettier-ignore -->
```css
@media ( max-width: 300px ) {}
/**    ↑                  ↑
 * The space inside these two parentheses */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be a single space inside the parentheses.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (max-width: 300px) {}
```

<!-- prettier-ignore -->
```css
@media (max-width: 300px ) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media ( max-width: 300px ) {}
```

### `"never"`

There _must never_ be whitespace on the inside the parentheses.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media ( max-width: 300px ) {}
```

<!-- prettier-ignore -->
```css
@media ( max-width: 300px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (max-width: 300px) {}
```
