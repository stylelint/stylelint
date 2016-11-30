# value-no-vendor-prefix

Disallow vendor prefixes for values.

```css
a { display: -webkit-flex; }
/**          ↑
 *  These prefixes */
```

## Options

### `true`

The following patterns are considered warnings:

```css
a { display: -webkit-flex; }
```

```css
a { max-width: -moz-max-content; }
```

```css
a { background: -webkit-linear-gradient(bottom, #000, #fff); }
```

The following patterns are *not* considered warnings:

```css
a { display: flex; }
```

```css
a { max-width: max-content; }
```

```css
a { background: linear-gradient(bottom, #000, #fff); }
```
