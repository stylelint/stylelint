# font-weight-notation

Require consistent numeric or named `font-weight` values.
Also, when named values are expected, require only valid names.

```css
a { font-weight: bold }
/**               ↑
 *    This notation */

a { font: italic small-caps 600 16px/3 cursive; }
/**                          ↑
*       And this notation, too */
```

Valid font-weight names are `normal`, `bold`, `bolder`, and `lighter`.

## Options

`string`: `"numeric"|"named"`

### `"numeric"`

`font-weight` values *must always* be numbers.

The following patterns are considered warnings:

```css
a { font-weight: bold; }
```

```css
a { font: italic normal 20px; }
```

The following patterns are *not* considered warnings:

```css
a { font-weight: 700; }
```

```css
a { font: italic 900 20px; }
```

### `"named"`

`font-weight` values *must always* be keyword names.

The following patterns are considered warnings:

```css
a { font-weight: 700; }
```

```css
a { font: italic 900 20px; }
```

The following patterns are *not* considered warnings:

```css
a { font-weight: bold; }
```

```css
a { font: italic normal 20px; }
```
