# block-closing-brace-space-before

Require a single space or disallow whitespace before the closing brace of blocks.

```css
    a { color: pink; }
/**                  ↑
 * The space before this brace */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space before the closing brace.

The following patterns are considered warnings:

```css
a{ color: pink;}
```

```css
a { color: pink;} b { color: red;}
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; } b { color: red; }
```

### `"never"`

There *must never* be whitespace before the closing brace.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; } b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a{ color: pink;}
```

```css
a { color: pink;} b { color: red;}
```
