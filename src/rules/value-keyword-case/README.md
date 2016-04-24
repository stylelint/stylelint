# value-keyword-case

Specify lowercase or uppercase for keywords values.

```css
    a { display: block; }
/**              ↑
 *    These values */
```

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered warnings:

```css
a {
  display: Block;
}
```

```css
a {
  display: bLoCk;
}
```

```css
a {
  display: BLOCK;
}
```

```css
a {
  transition: -WEBKIT-TRANSFORM 2s;
}
```

The following patterns are *not* considered warnings:

```css
a {
  display: block;
}
```

```css
a {
  transition: -webkit-transform 2s;
}
```

### `"upper"`

The following patterns are considered warnings:

```css
a {
  display: Block;
}
```

```css
a {
  display: bLoCk;
}
```

```css
a {
  display: block;
}
```

```css
a {
  transition: -webkit-transform 2s;
}
```

The following patterns are *not* considered warnings:

```css
a {
  display: BLOCK;
}
```

```css
a {
  transition: -WEBKIT-TRANSFORM 2s;
}
```

## Optional options

### `ignoreKeywords: ["/regex/", "non-regex"]`

Ignore case of keywords values.

For example, with `"lower"`, given:

```js
["Block", "/^(f|F)lex$/"]
```

The following patterns are considered warnings:

```css
a {
  display: bLoCk;
}
```

```css
a {
  display: BLOCK;
}
```

```css
a {
  display: fLeX;
}
```

```css
a {
  display: FLEX;
}
```

The following patterns are *not* considered warnings:

```css
a {
  display: block;
}
```

```css
a {
  display: Block;
}
```

```css
a {
  display: flex;
}
```

```css
a {
  display: Flex;
}
```

For example, with `"upper"`, given:

```js
["Block", "/^(f|F)lex$/"]
```

The following patterns are considered warnings:

```css
a {
  display: bLoCk;
}
```

```css
a {
  display: block;
}
```

```css
a {
  display: fLeX;
}
```

```css
a {
  display: fLEX;
}
```

The following patterns are *not* considered warnings:

```css
a {
  display: BLOCK;
}
```

```css
a {
  display: Block;
}
```

```css
a {
  display: FLEX;
}
```

```css
a {
  display: Flex;
}
```

```css
a {
  display: flex;
}
```
