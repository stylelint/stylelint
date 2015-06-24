# block-opening-brace-space-after

Require or disallow a space after the opening brace of blocks.

```css
    a { color: pink; }
/**   ↑
 * The space after this brace */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space after the opening brace.

The following patterns are considered warnings:

```css
a{color: pink;}
```

```css
a {color: pink;}
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a{ color: pink; }
```

### `"never"`

There *must never* be whitespace after the opening brace.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a{ color: pink; }
```

The following patterns are *not* considered warnings:

```css
a {color: pink;}
```

```css
a{color: pink;}
```
