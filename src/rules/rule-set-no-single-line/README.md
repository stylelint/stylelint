# rule-set-no-single-line

Disallow single-line rule-sets.

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
