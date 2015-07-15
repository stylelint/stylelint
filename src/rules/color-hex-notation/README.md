# color-hex-notation

Specify lowercase or uppercase notation for hex colors.

```css
    a { color: #fff }
/**              ↑
 * These hex colors */
```

## Options

`string`: `"lowecase"|"uppercase"`

### `"lowercase"`

The following patterns are considered warnings:

```css
a { color: #FFF; }
```

The following patterns are *not* considered warnings:


```css
a { color: #000; }
```

```css
a { color: #fff; }
```

### `"uppercase"`

The following patterns are considered warnings:

```css
a { color: #fff; }
```

The following patterns are *not* considered warnings:


```css
a { color: #000; }
```

```css
a { color: #FFF; }
```

