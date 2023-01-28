# function-parentheses-space-inside

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace on the inside of the parentheses of functions.

<!-- prettier-ignore -->
```css
a { transform: translate( 1, 1 ); }
/**                     ↑      ↑
 * The space inside these two parentheses */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There _must always_ be a single space inside of the parentheses.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1); }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1 ); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate( 1, 1 ); }
```

### `"never"`

There _must never_ be whitespace on the inside of the parentheses.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate( 1, 1 ); }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1 ); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1); }
```

### `"always-single-line"`

There _must always_ be a single space inside the parentheses of single-line functions.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1) }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1 ) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate( 1, 1 ) }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1,
  1) }
```

<!-- prettier-ignore -->
```css
a {
  transform: translate(
    1,
    1
  )
}
```

### `"never-single-line"`

There _must never_ be whitespace inside the parentheses of single-line functions.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate( 1, 1 ) }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1 ) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1, 1) }
```

<!-- prettier-ignore -->
```css
a { transform: translate( 1,
  1) }
```

<!-- prettier-ignore -->
```css
a {
  transform: translate(
    1,
    1
  )
}
```
