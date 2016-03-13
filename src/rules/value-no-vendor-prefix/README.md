# value-no-vendor-prefix

Disallow vendor prefixes for values.

```css
.foo { display: -webkit-flex; }
/**              ↑
 *  These prefixes */
```

The following patterns are considered warnings:

```css
.foo { display: -webkit-flex; }
```

```css
.foo { max-width: -moz-max-content; }
```

```css
.foo { background: -webkit-linear-gradient(bottom, #000, #fff); }
```

The following patterns are *not* considered warnings:

```css
.foo { display: flex; }
```

```css
.foo { max-width: max-content; }
```

```css
.foo { background: linear-gradient(bottom, #000, #fff); }
```
