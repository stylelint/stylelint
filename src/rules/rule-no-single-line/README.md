# rule-no-single-line

Disallow single-line rules.

The following patterns are considered warnings:

```css
a { color: pink; }
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
@media print {
 a {
   color: pink;
 }
}
```
