# selector-no-vendor-prefix

Disallow vendor prefixes for selectors.

```css
    input::-moz-placeholder {}
/**          ↑ 
 * These prefixes */
```

The following patterns are considered warnings:

```css
input::-moz-placeholder {}
```

```css
:-webkit-full-screen a {}
```

The following patterns are *not* considered warnings:

```css
input::placeholder {}
```

```css
:full-screen a {}
```
