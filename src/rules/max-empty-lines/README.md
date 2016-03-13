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
