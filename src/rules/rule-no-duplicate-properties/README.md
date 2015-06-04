# rule-no-duplicate-properties

Disallow duplicate properties within rules.

```css
    a { color: pink; color: orange; }
/**       ↑            ↑
 *  These duplicated properties */
```

The following patterns are considered warnings:

```css
a { color: pink; color: orange; }
```

```css
a { color: pink; background: orange; color: orange }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; background: orange; }
```
