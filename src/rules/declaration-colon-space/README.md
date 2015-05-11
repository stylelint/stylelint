# declaration-colon-before

Specify the whitespace before the colon within declarations.

## Options

* `nothing`: there *must* be nothing before the colon within declarations.
* `space`: there *must* be a single space before the colon within declarations.

### `nothing`

The following patterns are considered warnings:

```css
body {
  background : pink;
}
```

```css
body {
  background      : pink; /* multiple spaces */
}
```

```css
body {
  background  : pink; /* tab */
}
```

The following patterns are *not* considered warnings:

```css
body {
  background: pink;
}
```

```css
body {
  background:pink;
}
```

### `space`

The following patterns are considered warnings:

```css
body {
  background: pink;
}
```

```css
body {
  background      : pink; /* multiple spaces */
}
```

```css
body {
  background  : pink; /* tab */
}
```

The following patterns are *not* considered warnings:

```css
body {
  background : pink;
}
```

```css
body {
  background :pink;
}
```
