# selector-delimiter-space-before

Require or disallow a space before the delimiters of selectors.

```css
    a, b { color: pink; }
/**  ↑
 * The space before this delimiter */
```

## Options

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`


### `"always"`

There *must always* be a single space before the delimiters.

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

There *must never* be whitespace before the delimiters.

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

### `"always-single-line"`

There *must always* be a single space before the delimiters in single-line selectors.

The following patterns are considered warnings:

```css
a,b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a,
b { color: pink; }
```

### `"never-single-line"`

There *must never* be a single space before the delimiters in single-line selectors.

The following patterns are considered warnings:

```css
a ,b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a ,
b { color: pink; }
```
