# max-empty-lines

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Limit the number of adjacent empty lines.

<!-- prettier-ignore -->
```css
a {}
     /* ← */
     /* ← */
a {} /* ↑ */
/**     ↑
 * These lines */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`int`: Maximum number of adjacent empty lines allowed.

For example, with `2`:

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {}



b {}
```

Comment strings are also checked -- so the following is a problem:

<!-- prettier-ignore -->
```css
/*
 Call me Ishmael.



 Some years ago--never mind how long precisely-—...
 */
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}
b {}
```

<!-- prettier-ignore -->
```css
a {}

b {}
```

<!-- prettier-ignore -->
```css
a {}


b {}
```

## Optional secondary options

### `ignore: ["comments"]`

Only enforce the adjacent empty lines limit for lines that are not comments.

For example, with `2` adjacent empty lines:

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
/* horse */
a {}



b {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
/*
 Call me Ishmael.



 Some years ago -- never mind how long precisely -- ...
 */
```

<!-- prettier-ignore -->
```css
a {
    /*
     Comment




     inside the declaration with a lot of empty lines...
    */
     color: pink;
}
```
