# value-list-comma-space-after

Require a single space or disallow whitespace after the commas of value lists.

```css
a { background-size: 0, 0; }
/**                   ↑
 * The space after these commas */
```

## Options

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There *must always* be a single space after the commas.

The following patterns are considered warnings:

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0
      , 0; }
```

The following patterns are *not* considered warnings:

```css
a { background-size: 0, 0; }
```

```css
a { background-size: 0
      , 0; }
```

### `"never"`

There *must never* be whitespace after the commas.

The following patterns are considered warnings:

```css
a { background-size: 0, 0; }
```

```css
a { background-size: 0 ,
      0; }
```

The following patterns are *not* considered warnings:

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0
      ,0; }
```

### `"always-single-line"`

There *must always* be a single space after the commas in single-line value lists.

The following patterns are considered warnings:

```css
a { background-size: 0,0; }
```

The following patterns are *not* considered warnings:

```css
a { background-size: 0, 0; }
```

```css
a { background-size: 0
    , 0; }
```

```css
a { background-size: 0
      ,0; }
```

### `"never-single-line"`

There *must never* be whitespace after the commas in single-line value lists.

The following patterns are considered warnings:

```css
a { background-size: 0, 0; }
```

The following patterns are *not* considered warnings:

```css
a { background-size: 0,0; }
```

```css
a { background-size: 0
      ,0; }
```

```css
a { background-size: 0
      , 0; }
```
