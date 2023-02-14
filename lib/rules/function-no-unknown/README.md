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

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

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

## Optional secondary options

### `ignoreFunctions: ["/regex/", /regex/, "non-regex"]`

Ignore the specified functions.

For example, with `true`.

Given:

```json
["theme", "/^foo-/"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: theme(1); }
```

<!-- prettier-ignore -->
```css
a { transform: foo-func(1); }
```
