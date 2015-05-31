# no-eol-whitespace

Disallow end-of-line whitespace.

```css
    a { color: pink; }···   
/**                    ↑ 
 *       This whitespace */
```

The following patterns are considered warnings:

```css
a { color: pink; }·
```

```css
a { color: pink; }····
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```
