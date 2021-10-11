# unicode-bom

Require or disallow the Unicode Byte Order Mark.

## Options

`string`: `"always"|"never"`

### `"always"`

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
a {}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
U+FEFF
a {}
```

### `"never"`

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
U+FEFF
a {}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a {}
```
