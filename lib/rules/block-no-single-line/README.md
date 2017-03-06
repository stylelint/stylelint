# block-no-single-line

***Deprecated: instead use the [block-opening-brace-newline-after](../block-opening-brace-newline-after/README.md#always) and [block-closing-brace-newline-before](../block-closing-brace-newline-before/README.md#always) rules with the option `"always"`. See [the FAQs for an example](../../../docs/user-guide/faq.md#how-do-i-disallow-single-line-blocks).***

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
