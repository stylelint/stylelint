# function-no-unknown

This rule considers functions defined in the CSS Specificationsto be known.

This rule ignores double-dashed custom functions, e.g. --custom-function().

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: doesntexist(1); }
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
