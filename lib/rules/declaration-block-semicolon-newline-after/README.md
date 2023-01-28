# declaration-block-semicolon-newline-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a newline or disallow whitespace after the semicolons of declaration blocks.

<!-- prettier-ignore -->
```css
a {
  color: pink;
  top: 0;    ↑
}            ↑
/**          ↑
 * The newline after this semicolon */
```

This rule ignores:

- semicolons that are preceded by Less mixins
- the last semicolon of declaration blocks

Use the `block-closing-brace-*-before` rules to control the whitespace between the last semicolon and the closing brace instead.

This rule allows an end-of-line comment followed by a newline. For example,

<!-- prettier-ignore -->
```css
a {
  color: pink; /* end-of-line comment */
  top: 0;
}
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There _must always_ be a newline after the semicolon.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; top: 0; }
```

<!-- prettier-ignore -->
```css
a {
  color: pink; /* end-of-line comment
    containing a newline */
  top: 0;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: pink;
  top: 0;
}
```

<!-- prettier-ignore -->
```css
a {
  color: pink; /* end-of-line comment */
  top: 0;
}
```

### `"always-multi-line"`

There _must always_ be a newline after the semicolon in multi-line rules.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  color: pink; top: 0;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a { color: pink; top: 0; }
```

<!-- prettier-ignore -->
```css
a {
  color: pink;
  top: 0;
}
```

### `"never-multi-line"`

There _must never_ be whitespace after the semicolon in multi-line rules.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  color: pink;
  top: 0;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a { color: pink; top: 0; }
```

<!-- prettier-ignore -->
```css
a {
  color: pink
  ; top: 0;
}
```
