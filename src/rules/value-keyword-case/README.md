# value-keyword-case

Specify lowercase or uppercase for keywords values.

```css
    a { display: block; }
/**              ↑
 *    These values */
```

This rule ignores [`<custom-idents>`](https://developer.mozilla.org/en/docs/Web/CSS/custom-ident) of known properties. Values which are paired with non-properties (e.g. `$vars` and custom properties), and do not conform to the primary option, can be ignored using the `ignoreValues: []` secondary option.

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

For example, with `"lower"`.

Given:

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

For example, with `"upper"`.

Given:

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
