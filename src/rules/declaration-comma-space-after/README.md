# declaration-comma-space-after

Require or disallow a space after the commas of declarations.

```css
    a { background-size: 0, 0; }
/**                       ↑  
 * The space after these commas */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space after the comma.

The following patterns are considered warnings:

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0 ,0; }
```

The following patterns are *not* considered warnings:

```css
a { background-size: 0, 0; }
```

```css
a { background-size: 0 , 0; }
```

### `"never"`

There *must never* be whitespace after the comma.

The following patterns are considered warnings:

```css
a { background-size: 0, 0; }
```

```css
a { background-size: 0 , 0; }
```

The following patterns are *not* considered warnings:

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0 ,0; }
```
