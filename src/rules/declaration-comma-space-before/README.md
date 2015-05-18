# declaration-comma-space-before

Require or disallow a space before the commas of declarations.

```css
    a { background-size: 0, 0; }
/**                       ↑  
 * The space before these commas */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space before the comma.

The following patterns are considered warnings:

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0, 0; }
```

The following patterns are *not* considered warnings:

```css
a { background-size: 0 ,0; }
```

```css
a { background-size: 0 , 0; }
```

### `"never"`

There *must never* be whitespace before the comma.

The following patterns are considered warnings:

```css
a { background-size: 0 ,0; }
```

```css
a { background-size: 0 , 0; }
```

The following patterns are *not* considered warnings:

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0, 0; }
```
