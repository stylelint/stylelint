# property-shorthand-no-unnecessary-value

Disallow longhand form for properties that support it.

```css
.foo { margin: 1px 1px 1px 1px; }
/**            ↑
 *  These properties */
```

The rule warns when you use longhand form for properties:

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
