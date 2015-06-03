# selector-delimiter-newline-after

Require or disallow a newline after the delimiters in a selector.

```css
    a, 
    b↑{ color: pink; }
/**  ↑  
 * The newline after this delimiter */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single newline after the delimiter.

The following patterns are considered warnings:

```css
a, b { color: pink; }
```

```css
a
, b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a, 
b { color: pink; }
```

```css
a
,
b { color: pink; }
```

### `"never"`

There *must never* be whitepace after the delimiter.

The following patterns are considered warnings:

```css
a,
b { color: pink; }
```

```css
a
, 
b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a,b { color: pink; }
```

```css
a
,b { color: pink; }
```
