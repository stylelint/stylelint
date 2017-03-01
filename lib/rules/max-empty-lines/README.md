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

## Options

`int`: Maximum number of characters allowed.

For example, with `2`:

The following patterns are considered warnings:

```css
a {}



b {}
```

Comment strings are also checked -- so the following is a warning:

```css
/**
 * Call me Ishmael.
 *
 *
 *
 * Some years ago -- never mind how log precisely -- ...
 */
```

The following patterns are *not* considered warnings:

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

The following patterns are considered warnings:

```css
/* horse */
a {}



b {}
```

The following patterns are *not* considered warnings:

```css
/**
 * Call me Ishmael.
 *
 *
 *
 * Some years ago -- never mind how log precisely -- ...
 */
```

```css
a { 
    /**
    * Comment 
    *
    *
    *
    * inside the declaration with a lot of empty lines...
    */
     color: pink; 
}
```
