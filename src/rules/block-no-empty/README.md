# block-no-empty

Disallow empty blocks.

```css
 a { }
/** ↑
 * Blocks like this */
```

The following patterns are considered warnings:

```css
a {}
```

```css
a { }
```

```css
@media print { a {} }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
@media print { a { color: pink; } }
```
