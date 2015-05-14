# declaration-no-important

Disallow `!important` within declarations.

The following patterns are considered warnings:

```css
a { color: pink !important; }
```

```css
a { color: pink ! important; }
```

```css
a { color: pink!important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```
