# font-weight-notation

Require numeric or named (where possible) `font-weight` values.

<!-- prettier-ignore -->
```css
a { font-weight: bold; }
/**              ↑
 *               This notation */

a { font: italic small-caps 600 16px/3 cursive; }
/**                         ↑
 *                          And this notation, too */

@font-face { font-weight: normal bold; }
/**                       ↑
 *                        Multiple notations are available in @font-face */
```

This rule ignores `$sass`, `@less`, and `var(--custom-property)` variable syntaxes.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"numeric"|"named-where-possible"`

### `"numeric"`

`font-weight` values _must always_ be numbers.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { font-weight: bold; }
```

<!-- prettier-ignore -->
```css
a { font: italic normal 20px sans-serif; }
```

<!-- prettier-ignore -->
```css
@font-face { font-weight: normal bold; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-weight: 700; }
```

<!-- prettier-ignore -->
```css
a { font: italic 400 20px; }
```

<!-- prettier-ignore -->
```css
@font-face { font-weight: 400 700; }
```

### `"named-where-possible"`

`font-weight` values _must always_ be keywords when an appropriate keyword is available.

This means that only `400` and `700` will be rejected, because those are the only numbers with keyword equivalents (`normal` and `bold`).

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { font-weight: 700; }
```

<!-- prettier-ignore -->
```css
a { font: italic 400 20px sans-serif; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-weight: bold; }
```

<!-- prettier-ignore -->
```css
a { font: italic normal 20px sans-serif; }
```

## Optional secondary options

### `ignore: ["relative"]`

Ignore the [_relative_](https://drafts.csswg.org/css-fonts/#font-weight-prop) keyword names of `bolder` and `lighter`.

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-weight: 400; }
a b { font-weight: lighter; }
```
