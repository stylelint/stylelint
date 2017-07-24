# no-missing-end-of-source-newline

Disallow missing end-of-source newlines.

```css
    a { color: pink; }
    \n
/** ↑
 * This newline */
```

Completely empty files are not considered violations.

## Options

### `true`

The following patterns are considered violations:

```css
a { color: pink; }
```

The following patterns are *not* considered violations:

```css
a { color: pink; }
\n
```
