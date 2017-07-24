# property-case

Specify lowercase or uppercase for properties.

```css
    a { width: 1px; }
/**     ↑
 * These properties */
```

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered violations:

```css
a {
  Width: 1px
}
```

```css
a {
  WIDTH: 1px
}
```

```css
a {
  widtH: 1px
}
```

```css
a {
  border-Radius: 5px;
}
```

```css
a { 
  -WEBKIT-animation-duration: 3s; 
}
```

```css
@media screen and (orientation: landscape) { 
  WiDtH: 500px; 
}
```

The following patterns are *not* considered violations:

```css
a {
  width: 1px
}
```

```css
a {
  border-radius: 5px;
}
```

```css
a { 
  -webkit-animation-duration: 3s; 
}
```

```css
@media screen and (orientation: landscape) { 
  width: 500px; 
}
```

### `"upper"`

The following patterns are considered violations:

```css
a {
  Width: 1px
}
```

```css
a {
  width: 1px
}
```

```css
a {
  widtH: 1px
}
```

```css
a {
  border-Radius: 5px;
}
```

```css
a { 
  -WEBKIT-animation-duration: 3s; 
}
```

```css
@media screen and (orientation: landscape) { 
  WiDtH: 500px; 
}
```

The following patterns are *not* considered violations:

```css
a {
  WIDTH: 1px
}
```

```css
a {
  BORDER-RADIUS: 5px;
}
```

```css
a { 
  -WEBKIT-ANIMATION-DURATION: 3s; 
}
```

```css
@media screen and (orientation: landscape) { 
  WIDTH: 500px; 
}
```
