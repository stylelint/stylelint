# no-missing-eof-newline

Disallow missing end-of-file newlines in non-empty files.

```css
    a { color: pink; }
    \n
/** ↑
 * This newline */
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

Completely empty files are not considered warnings.
