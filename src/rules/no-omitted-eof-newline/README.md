# no-omitted-eof-newline

Disallow omitted end-of-file newline.

```css
    a { color: pink; }
\n
/** ↑
 *  This newline */
```

The following patterns are considered warnings:

```css
a { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
\n
```
