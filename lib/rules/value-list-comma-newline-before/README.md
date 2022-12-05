# value-list-comma-newline-before

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a newline or disallow whitespace before the commas of value lists.

<!-- prettier-ignore -->
```css
  a { background-size: 0
    , 0; }
/** ↑
 * The newline before this comma */
```

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There _must always_ be a newline before the commas.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { background-size: 0,0; }
```

<!-- prettier-ignore -->
```css
a { background-size: 0,
      0; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { background-size: 0
      , 0; }
```

### `"always-multi-line"`

There _must always_ be a newline before the commas in multi-line value lists.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { background-size: 0,
      0; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { background-size: 0, 0; }
```

<!-- prettier-ignore -->
```css
a { background-size: 0,0; }
```

<!-- prettier-ignore -->
```css
a { background-size: 0
      , 0; }
```

### `"never-multi-line"`

There _must never_ be whitespace before the commas in multi-line value lists.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { background-size: 0
      , 0; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { background-size: 0,0; }
```

<!-- prettier-ignore -->
```css
a { background-size: 0, 0; }
```

<!-- prettier-ignore -->
```css
a { background-size: 0,
      0; }
```
