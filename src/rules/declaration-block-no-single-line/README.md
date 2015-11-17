# declaration-block-no-single-line

Disallow single-line declaration blocks.

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
@media print {
 a { color: pink; }
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
