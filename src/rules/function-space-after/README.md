# function-space-after

Require a single space or disallow whitespace after functions.

```css
    a { transform: translate(1, 1) scale(3); }
/**                               ↑
 *                       This space */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space after the function.

The following patterns are considered warnings:

```css
a { transform: translate(1, 1)scale(3); }
```

The following patterns are *not* considered warnings:

```css
a { transform: translate(1, 1) scale(3); }
```

### `"never"`

There *must never* be whitespace after the function.

The following patterns are considered warnings:

```css
a { transform: translate(1, 1) scale(3); }
```

The following patterns are *not* considered warnings:

```css
a { transform: translate(1, 1)scale(3); }
```
