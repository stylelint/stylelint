# selector-delimiter-space-before

Require or disallow a space before the delimiters of selectors.

```css
    a, b { color: pink; }
/**  ↑  
 * The space before this delimiter */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space before the delimiter.

The following patterns are considered warnings:

```css
a,b { color: pink; }
```

```css
a, b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a ,b { color: pink; }
```

```css
a , b { color: pink; }
```

### `"never"`

There *must never* be whitespace before the delimiter.

The following patterns are considered warnings:

```css
a ,b { color: pink; }
```

```css
a , b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a,b { color: pink; }
```

```css
a, b { color: pink; }
```
