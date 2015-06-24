# property-no-vendor-prefix

Disallow vendor prefixes for properties.

```css
    a { -webkit-transform: scale(1); }
/**         ↑
 * These prefixes */
```

The following patterns are considered warnings:

```css
a { -webkit-transform: scale(1); }
```

```css
a { -moz-columns: 2; }
```

The following patterns are *not* considered warnings:

```css
a { transform: scale(1); }
```

```css
a {
columns: 2; }
```
