# function-comma-newline-before

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a newline or disallow whitespace before the commas of functions.

<!-- prettier-ignore -->
```css
  a { transform: translate(1
    , 1) }
/** ↑
 * This comma */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There _must always_ be a newline before the commas.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1,1) }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1 ,1) }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1,
  1) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  transform: translate(1
    ,1)
}
```

<!-- prettier-ignore -->
```css
a {
  transform: translate(1
    , 1)
}
```

### `"always-multi-line"`

There _must always_ be a newline before the commas in multi-line functions.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1,
  1) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1,1) }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1 ,1) }
```

<!-- prettier-ignore -->
```css
a {
  transform: translate(1
    ,1)
}
```

<!-- prettier-ignore -->
```css
a {
  transform: translate(1
    , 1)
}
```

### `"never-multi-line"`

There _must never_ be whitespace before the commas in multi-line functions.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1 ,
  1) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: translate(1 ,1) }
```

<!-- prettier-ignore -->
```css
a { transform: translate(1 , 1) }
```

<!-- prettier-ignore -->
```css
a {
  transform: translate(1,
    1)
}
```
