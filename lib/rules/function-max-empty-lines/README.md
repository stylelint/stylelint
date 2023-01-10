# function-max-empty-lines

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Limit the number of adjacent empty lines within functions.

<!-- prettier-ignore -->
```css
a {
  transform:
    translate(
                /* ← */
      1,        /* ↑ */
                /* ← */
      1         /* ↑ */
                /* ← */
    );          /* ↑ */
}               /* ↑ */
/**                ↑
 *            These lines */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`int`: Maximum number of adjacent empty lines allowed.

For example, with `0`:

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  transform:
    translate(

      1,
      1
    );
}
```

<!-- prettier-ignore -->
```css
a {
  transform:
    translate(
      1,

      1
    );
}
```

<!-- prettier-ignore -->
```css
a {
  transform:
    translate(
      1,
      1

    );
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  transform:
    translate(
      1,
      1
    );
}
```
