# function-calc-no-unspaced-operator

Disallow an unspaced operator within `calc` functions.

```css
a { top: calc(1px + 2px); }
/**               ↑
 * The space around this operator */
```

The following patterns are considered warnings:

```css
a { top: calc(1px+2px); }
```

```css
a { top: calc(1px+ 2px); }
```

The following patterns are *not* considered warnings:

```css
a { top: calc(1px + 2px); }
```

```css
a { top: calc(calc(1em * 2) / 3); }
```
