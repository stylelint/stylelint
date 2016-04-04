# block-closing-brace-newline-after

Require a newline or disallow whitespace after the closing brace of blocks.

```css
a { color: pink; }
a { color: red; }↑
/**              ↑
 * The newline after this brace */
```

This rule allows an end-of-line comment separated from the closing brace by spaces, as long as the comment contains no newlines. For example,

```css
a {
  color: pink;
} /* end-of-line comment */
```

## Options

`string`: `"always"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be a newline after the closing brace.

The following patterns are considered warnings:

```css
a { color: pink; }b { color: red; }
```

```css
a { color: pink;
} b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
b { color: red; }
```

### `"always-single-line"`

There *must always* be a newline after the closing brace in single-line blocks.

The following patterns are considered warnings:

```css
a { color: pink; } b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink;
} b { color: red; }
```

```css
a { color: pink; }
b { color: red; }
```

### `"never-single-line"`

There *must never* be whitespace after the closing brace in single-line blocks.

The following patterns are considered warnings:

```css
a { color: pink; } b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }b { color: red; }
```

```css
a { color: pink;
} b { color: red; }
```

### `"always-multi-line"`

There *must always* be a newline after the closing brace in multi-line blocks.

The following patterns are considered warnings:

```css
a { color: pink;
}b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }b { color: red; }
```

```css
a { color: pink;
}
b { color: red; }
```

### `"never-multi-line"`

There *must never* be whitespace after the closing brace in multi-line blocks.

The following patterns are considered warnings:

```css
a { color: pink;
} b { color: red; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; } b { color: red; }
```

```css
a { color: pink;
}b { color: red; }
```

## Optional options

### `ignoreAtRules: ["/regex/", "non-regex"]`

Given `["if", "else"]`:

The following patterns are *not* considered warnings:

```css
@if ... {
  color: pink;
} @else if ... {
  color: red;
} @else {
  color: blue;
}
```

```css
@if ... { color: pink; } @else { color: blue; }
```
