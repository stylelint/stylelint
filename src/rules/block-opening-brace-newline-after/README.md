# block-opening-brace-newline-after

Require or disallow a newline after the opening brace of a block.

```css
    a { 
      ↑ color: pink; }
/**   ↑  
 * The newline after this brace */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single newline after the opening brace.

The following patterns are considered warnings:

```css
a{ color: pink; }
```

```css
a {color: pink;}
```

The following patterns are *not* considered warnings:

```css
a{
color: pink; }
```

```css
a {
color: pink; }
```

### `"never"`

There *must never* be whitespace after the opening brace.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a {
color: pink;}
```

The following patterns are *not* considered warnings:

```css
a{color: pink; }
```
