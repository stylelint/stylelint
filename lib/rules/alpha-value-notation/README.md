# alpha-value-notation

Specify percentage or number notation for alpha-values.

<!-- prettier-ignore -->
```css
    a { color: rgb(0 0 0 / 0.5) }
/**                        ↑
 *                         This notation */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`string`: `"number"|"percentage"`

### `"number"`

Alpha-values _must always_ use the number notation.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 50% }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 50%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 0.5 }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 0.5) }
```

### `"percentage"`

Alpha-values _must always_ use percentage notation.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 0.5 }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 0.5) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 50% }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 50%) }
```

## Optional secondary options

### `exceptProperties: ["/regex/", /regex/, "string"]`

Reverse the primary option for matching properties.

For example with `"percentage"`.

Given:

```json
["opacity"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 50% }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 0.5) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { opacity: 0.5 }
```

<!-- prettier-ignore -->
```css
a { color: rgb(0 0 0 / 50%) }
```
