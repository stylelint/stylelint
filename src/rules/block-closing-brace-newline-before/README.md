# block-closing-brace-newline-before

Require or disallow a newline before the closing brace of blocks.

```css
    a { color: pink; 
    }
/** ↑  
 * The newline before this brace */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single newline before the closing brace.

The following patterns are considered warnings:

```css
a { color: pink; } b { color: red;}
```

```css
a { color: pink; } 
b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink;
} b { color: red; }
```

### `"never"`

There *must never* be whitespace before the closing brace.

The following patterns are considered warnings:

```css
a { color: pink;
} b { color: red; }
```

```css
a { color: pink; } b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink;}b { color: red; }
```
