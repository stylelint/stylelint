# value-no-redundant-longhand

Disallow redundant values in longhand properties.

```css
.foo { margin: 1px 1px 1px 1px; }
/**            ↑
 *  These properties */
```

This rule warns you when you use redundant values in the following longhand properties:

- `margin`
- `padding`
- `border-color`
- `border-radius`
- `border-style`
- `border-width`

The following patterns are considered warnings:

```css
.foo { margin: 1px 1px; }
```

```css
.foo { margin: 1px 1px 1px 1px; }
```

```css
.foo { padding: 1px 2px 1px; }
```

```css
.foo { border-radius: 1px 2px 1px 2px; }
```

```css
.foo { -webkit-border-radius: 1px 1px 1px 1px; }
```

The following patterns are *not* considered warnings:

```css
.foo { margin: 1px; }
```

```css
.foo { margin: 1px 1px 1px 2px; }
```

```css
.foo { padding: 1px 1em 1pt 1pc; }
```

```css
.foo { border-radius: 10px / 5px; }
```
