# no-eol-whitespace

Disallow end-of-line whitespace.

```css
a { color: pink; }···
/**               ↑
 *  This whitespace */
```

The following patterns are considered warnings:

```css
a { color: pink; }·
```

```css
a { color: pink; }····
```

Comment strings are also checked -- so the following is a warning:

```css
/* something····
 * something else */
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
/* something
 * something else */
```
