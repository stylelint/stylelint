# unit-no-unknown

Disallow unknown units.

```css
a { width: 100pixels; }
/**           ↑
 *  These units */
```

The following patterns are considered warnings:

```css
a {
  width: 10pixels;
}
```

```css
a {
  width: calc(10px + 10pixels);
}
```

The following patterns are *not* considered warnings:

```css
a {
  width: 10px;
}  
```

```css
a {
  width: 10Px;
}  
```

```css
a {
  width: 10pX;
}  
```

```css
a {
  width: calc(10px + 10px);
}
```

## Optional options

### `ignoreUnits: ["array", "of", "units"]`

Allow unknown units.

For example, given:

```js
["pixels"]
```

The following patterns are considered warnings:

```css
a {
  width: 10pix;
}
```

The following patterns are *not* considered warnings:

```css
a {
  width: 10px;
}
```

```css
a {
  width: 10pixels;
}
```
