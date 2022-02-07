# function-no-unknown

Disallow unknown functions.

<!-- prettier-ignore -->
```css
a { transform: unknown(1); }
/**            ↑
 * Functions like this */
```

This rule considers functions defined in the CSS Specifications to be known.

This rule ignores double-dashed custom functions, e.g. `--custom-function()`.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: unknown(1); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
```

<!-- prettier-ignore -->
```css
a { transform: --custom-function(1); }
```
