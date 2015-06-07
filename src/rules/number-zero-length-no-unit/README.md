# number-zero-length-no-unit

Disallow units for lengths of zero.

```css
    a { top: 0px; }
/**          ↑ ↑
 * This zero and this unit */
```

The following patterns are considered warnings:

```css
a { top: 0px }
```

```css
a { top: 0.000px }
```

The following patterns are *not* considered warnings:

```css
a { top: 0 }
```

```css
a { top: 1px }
```

```css
a { top: 1.001px }
```
