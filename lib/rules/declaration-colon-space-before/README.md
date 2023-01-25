# declaration-colon-space-before

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace before the colon of declarations.

<!-- prettier-ignore -->
```css
a { color :pink }
/**       ↑
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
a { color: pink }
```

<!-- prettier-ignore -->
```css
a { color:pink }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color : pink }
```

<!-- prettier-ignore -->
```css
a { color :pink }
```

### `"never"`

There _must never_ be whitespace before the colon.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color : pink }
```

<!-- prettier-ignore -->
```css
a { color :pink }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink }
```

<!-- prettier-ignore -->
```css
a { color:pink }
```
