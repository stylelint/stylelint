# max-line-length

Limit the length of a line.

```css
a { color: red }
/**            ↑
 *       The end */
```

Lines that exceed the maximum length but contain no whitespace (other than at the beginning of the line) are ignored.

When evaluating the line length, `url(...)` functions are collapsed into just `url()`, because typically you have no control over the length of its argument. This means that long `url()` functions should not contribute to warnings.

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
```

## Optional options

### `ignore: ["non-comments"]`

Only enforce the line-length limit for lines within comments.

This does not apply to comments that are stuck in between other stuff, only to lines that begin at the beginning or in the middle of a comment.

For example, with a maximum length of `30`, the following each have only one warning:

```css
/* This line is too long for my rule */
a { color: pink; background: orange; }
a { color: pink; /* this comment is also long but not on its own line */ }
```

```css
a { color: pink; background: orange; }
/**
 * This line is short,
 * but this line is too long for my liking,
 * though this one is fine
 */
a { color: pink; /* this comment is also long but not on its own line */ }
```
