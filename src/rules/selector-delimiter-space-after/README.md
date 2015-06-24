# selector-delimiter-space-after

Require or disallow a space after the delimiters of selectors.

```css
    a, b { color: pink; }
/**  ↑
 * The space after this delimiter */
```

## Options

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`


### `"always"`

There *must always* be a single space after the delimiter.

The following patterns are considered warnings:

```css
a,b { color: pink; }
```

```css
a ,b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a, b { color: pink; }
```

```css
a , b { color: pink; }
```

### `"never"`

There *must never* be whitespace after the delimiter.

The following patterns are considered warnings:

```css
a, b { color: pink; }
```

```css
a , b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a,b { color: pink; }
```

```css
a ,b { color: pink; }
```

### `"always-single-line"`

There *must always* be a single space after the delimiter in single-line selectors.

The following patterns are considered warnings:

```css
a,b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a
,b { color: pink; }
```

### `"never-single-line"`

There *must never* be a single space after the delimiter in single-line selectors.

The following patterns are considered warnings:

```css
a, b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a
, b { color: pink; }
```
