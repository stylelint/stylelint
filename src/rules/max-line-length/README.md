# max-line-length

Limit the length of a line.

```css
    a { color: red }
/**                ↑
 *           The end */
```

Lines that exceed the maximum length but contain no whitespace (other than at the beginning of the line) are ignored.

When evaluating the line length, `url(...)` functions are collapsed into just `url()`,
because typically you have no control over the length of its argument.
This means that long `url()` functions should not contribute to warnings.

## Options

`int`: Maximum number of characters allowed.

For example, with `20`:

The following patterns are considered warnings:

```css
a { color: 0; top: 0; }
```

```css
a {
  background: url(a-url-that-is-over-20-characters-long);
}
```

The following patterns are *not* considered warnings:

```css
a {
  color: 0;
  top: 0;
}
```

```css
a {
  background: url(a-url-that-is-over-20-characters-long);
}
