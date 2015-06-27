# block-closing-brace-newline-after

Require a newline or disallow whitespace after the closing brace of blocks.

```css
    a { color: pink; }
    b { color: red; }↑
/**                  ↑
 * The newline after this brace */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a newline after the closing brace.

The following patterns are considered warnings:

```css
a { color: pink; } b { color: red; }
```

```css
a { color: pink;
} b { color: red;}
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
b { color: red; }
```

### `"never"`

There *must never* be whitespace after the closing brace.

The following patterns are considered warnings:

```css
a { color: pink; }
b { color: red; }
```

```css
a { color: pink; } b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }b { color: red; }
```
