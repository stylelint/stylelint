# selector-root-no-composition

Disallow the composition of `:root` in selectors.

```css
    a, :root {}
/** ↑  ↑
 * This type of composite selector */
```

The following patterns are considered warnings:

```css
a, :root {}
```

```css
:root + a {}
```

```css
html:root {}
```

The following patterns are *not* considered warnings:

```css
:root {}
```
