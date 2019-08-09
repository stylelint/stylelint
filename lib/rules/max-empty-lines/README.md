# max-empty-lines

Limit the number of adjacent empty lines.

```css
a {}
     /* ← */
     /* ← */
a {} /* ↑ */
/**     ↑
 * These lines */
```

The `--fix` option on the [command line](../../../docs/user-guide/cli.md#autofixing-errors) can automatically fix all of the problems reported by this rule.

## Options

`int`: Maximum number of adjacent empty lines allowed.

For example, with `2`:

The following patterns are considered violations:

```css
a {}



b {}
```

Comment strings are also checked -- so the following is a violation:

```css
/*
 Call me Ishmael.



 Some years ago -- never mind how log precisely -- ...
 */
```

The following patterns are *not* considered violations:

```css
a {}
b {}
```

```css
a {}

b {}
```

```css
a {}


b {}
```

## Optional secondary options

### `ignore: ["comments"]`

Only enforce the adjacent empty lines limit for lines that are not comments.

For example, with `2` adjacent empty lines:

The following patterns are considered violations:

```css
/* horse */
a {}



b {}
```

The following patterns are *not* considered violations:

```css
/*
 Call me Ishmael.



 Some years ago -- never mind how long precisely -- ...
 */
```

```css
a {
    /*
     Comment




     inside the declaration with a lot of empty lines...
    */
     color: pink;
}
```
