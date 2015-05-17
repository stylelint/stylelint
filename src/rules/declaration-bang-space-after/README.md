# declaration-bang-space-after

Require or disallow a space after the bang of declarations.

```css
    a { color: pink !important; }
/**                 ↑
 * The space after this exclamation mark */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space after the bang.

The following patterns are considered warnings:

```css
a { color: pink !important; }
```

```css
a { color: pink      !important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink ! important; }
```

```css
a { color: pink! important; }
```

### `"never"`

There *must never* be whitespace after the bang.

The following patterns are considered warnings:

```css
a { color: pink ! important; }
```

```css
a { color: pink! important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink !important; }
```

```css
a { color:pink!important; }
```
