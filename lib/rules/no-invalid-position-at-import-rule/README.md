# no-invalid-position-at-import-rule

Disallow invalid position `@import` rules within a stylesheet.

<!-- prettier-ignore -->
```css
a {}
@import 'foo.css';
/**   ↑
  * Invalid position */
```

## Options

### `true`

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a {}
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@media print {}
@import 'foo.css';
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
@import 'foo.css';
a {}
```

<!-- prettier-ignore -->
```css
/* some comment */
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@charset 'utf-8';
@import 'foo.css';
```
