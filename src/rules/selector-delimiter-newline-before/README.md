# selector-delimiter-newline-before

Require or disallow a newline before the delimiters of selectors.

```css
    a
    , b { color: pink; }
/** ↑  
 * The newline before this delimiter */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single newline before the delimiter.

The following patterns are considered warnings:

```css
a, b { color: pink; }
```

```css
a, 
b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a
, b { color: pink; }
```

```css
a
,b { color: pink; }
```

### `"never"`

There *must never* be whitepace before the delimiter.

The following patterns are considered warnings:

```css
a ,b { color: pink; }
```

```css
a
, b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a,b { color: pink; }
```

```css
a,
b { color: pink; }
```
