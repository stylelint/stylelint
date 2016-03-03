# number-no-trailing-zeros

Disallow trailing zeros in numbers.

```css
a { top: 0.5000px; bottom: 1.0px; }
/**         ↑                ↑
 *        These trailing zeros */
```

The following patterns are considered warnings:

```css
a { top: 1.0px }
```

```css
a { top: 1.01000px }
```

The following patterns are *not* considered warnings:

```css
a { top: 1px }
```

```css
a { top: 1.01px }
```
