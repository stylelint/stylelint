# block-opening-brace-newline-after

Require a newline or disallow whitespace after the opening brace of blocks.

```css
    a {
      ↑ color: pink; }
/**   ↑
 * The newline after this brace */
```

End-of-line comments are allowed one space after the opening brace.

```css
a { /* something to say */
  color: pink;
}
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a newline after the opening brace.

The following patterns are considered warnings:

```css
a{ color: pink; }
```

```css
a {color: pink;}
```

The following patterns are *not* considered warnings:

```css
a{
color: pink; }
```

```css
a {
color: pink; }
```

### `"never"`

There *must never* be whitespace after the opening brace.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a {
color: pink;}
```

The following patterns are *not* considered warnings:

```css
a{color: pink; }
```
