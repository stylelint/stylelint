# shorthand-property-no-redundant-values

Disallow redundant values in shorthand properties.

```css
a { margin: 1px 1px 1px 1px; }
/**             ↑   ↑   ↑
 *           These values */
```

This rule warns you when you use redundant values in the following shorthand properties:

-   `margin`
-   `padding`
-   `border-color`
-   `border-radius`
-   `border-style`
-   `border-width`

## Options

### `true`

The following patterns are considered warnings:

```css
a { margin: 1px 1px; }
```

```css
a { margin: 1px 1px 1px 1px; }
```

```css
a { padding: 1px 2px 1px; }
```

```css
a { border-radius: 1px 2px 1px 2px; }
```

```css
a { -webkit-border-radius: 1px 1px 1px 1px; }
```

The following patterns are *not* considered warnings:

```css
a { margin: 1px; }
```

```css
a { margin: 1px 1px 1px 2px; }
```

```css
a { padding: 1px 1em 1pt 1pc; }
```

```css
a { border-radius: 10px / 5px; }
```
