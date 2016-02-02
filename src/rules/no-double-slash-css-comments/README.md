# no-double-slash-css-comments

Disallow double-slash comments (`//...`) which are not supported by CSS and could lead to unexpected results.

```css
    a { // color: pink; }···
/**     ↑
 *      This comment */
```

The following patterns are considered warnings:

```css
a { // color: pink; }·
```

```css
// a { color: pink; }····
```

The following patterns are *not* considered warnings:

```css
a { /* color: pink; */ }
```

```css
/* a { color: pink; } */
```
