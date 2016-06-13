# block-no-single-line

Disallow single-line blocks.

```css
  a { color: pink; top: 0; }
/** ↑                      ↑
 * Declaration blocks like this */
```

## Options

### `true`

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a,
b { color: pink; }
```

```css
a { color: pink; top: 1px; }
```

```css
@media print { a { color: pink; } }
```

```css
@media print {
  a { color: pink; }
}
```

```css
a {
  color: red;
  @media print { color: pink; }
}
```

The following patterns are *not* considered warnings:

```css
a {
  color: pink;
}
```

```css
a, b {
  color: pink;
}
```

```css
@media print {
 a {
   color: pink;
 }
}
```

```css
a {
  color: red;
  @media print {
    color: pink;
  }
}
```
