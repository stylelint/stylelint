# block-opening-brace-newline-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a newline after the opening brace of blocks.

<!-- prettier-ignore -->
```css
  a {
    ↑ color: pink; }
/** ↑
 * The newline after this brace */
```

This rule allows an end-of-line comment followed by a newline. For example,

<!-- prettier-ignore -->
```css
a { /* end-of-line comment */
  color: pink;
}
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There _must always_ be a newline after the opening brace.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a{ color: pink; }
```

<!-- prettier-ignore -->
```css
a{ color: pink;
}
```

<!-- prettier-ignore -->
```css
a{ /* end-of-line comment
  with a newline */
  color: pink;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
color: pink; }
```

<!-- prettier-ignore -->
```css
a
{
color: pink; }
```

<!-- prettier-ignore -->
```css
a { /* end-of-line comment */
  color: pink;
}
```

### `"always-multi-line"`

There _must always_ be a newline after the opening brace in multi-line blocks.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a{color: pink;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a {
color: pink; }
```

### `"never-multi-line"`

There _must never_ be whitespace after the opening brace in multi-line blocks.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a {color: pink;
}
```

## Optional secondary options

### `ignore: ["rules"]`

Ignore the opening brace of rules.

For example, with `"always"`:

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a { color: pink; }
```
