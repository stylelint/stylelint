# selector-max-empty-lines

Limit the number of adjacent empty lines within selectors.

```css
a,
              /* ← */
b {        /* ↑ */
  color: red; /* ↑ */
}             /* ↑ */
/**              ↑
 *        This empty line */
```

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`int`: Maximum number of adjacent empty lines allowed.

For example, with `0`:

The following patterns are considered violations:

```css
a

b {
  color: red;
}
```

```css
a,

b {
  color: red;
}
```

```css
a

>
b {
  color: red;
}
```

```css
a
>

b {
  color: red;
}
```

The following patterns are *not* considered violations:

```css
a b {
  color: red;
}
```

```css
a
b {
  color: red;
}
```

```css
a,
b {
  color: red;
}
```

```css
a > b {
  color: red;
}
```

```css
a
>
b {
  color: red;
}
```
