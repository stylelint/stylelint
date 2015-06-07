# no-multiple-empty-lines

Disallow multiple empty lines.

The following patterns are considered warnings:

```css
a {}


b {}
```

The following patterns are *not* considered warnings:

```css
a {}

b {}
```

```css
a {}
b {}
```

```css
a {} b {}
```
