# declaration-no-important

Disallow the use of `!important` within declarations.

The following patterns are considered warnings:

```css
body {
  background: pink !important;
}
```

```css
body {
  background: pink ! important;
}
```

```css
body {
  background: pink!important;
}
```

The following patterns are *not* considered warnings:

```css
body {
  background: pink;
}
```
