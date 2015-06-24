# selector-delimiter-newline-after

Require or disallow a newline after the delimiters of selectors.

```css
    a,
    b↑{ color: pink; }
/**  ↑
 * The newline after this delimiter */
```

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

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

### `"always-multi-line"`

There *must always* be a single newline after the delimiter in multi-line selectors.

The following patterns are considered warnings:

```css
a
, b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a, b { color: pink; }
```

```css
a,
b { color: pink; }
```

```css
a
,
b { color: pink; }
```

### `"never-multi-line"`

There *must never* be whitespace after the delimiter in multi-line selectors.

The following patterns are considered warnings:

```css
a
, b { color: pink; }
```

```css
a,
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
