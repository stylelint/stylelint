# selector-delimiter-newline-before

Require a newline or disallow whitespace before the delimiters of selectors.

```css
    a
    , b { color: pink; }
/** ↑
 * The newline before this delimiter */
```

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline before the delimiters.

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

### `"always-multi-line"`

There *must always* be a newline before the delimiters in multi-line selectors.

The following patterns are considered warnings:

```css
a,
b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a, b { color: pink; }
```

```css
a
,b { color: pink; }
```

```css
a
,
b { color: pink; }
```

### `"never-multi-line"`

There *must never* be whitespace before the delimiters in multi-line selectors.

The following patterns are considered warnings:

```css
a
, b { color: pink; }
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
a,
b { color: pink; }
```
