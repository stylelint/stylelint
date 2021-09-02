# function-calc-no-unspaced-operator

Disallow an unspaced operator within `calc` functions.

<!-- prettier-ignore -->
```css
a { top: calc(1px + 2px); }
/**               ↑
 * The space around this operator */
```

Before the operator, there must be a single whitespace or a newline plus indentation. After the operator, there must be a single whitespace or a newline.

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `true`

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a { top: calc(1px+2px); }
```

<!-- prettier-ignore -->
```css
a { top: calc(1px+ 2px); }
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
a { top: calc(1px + 2px); }
```

<!-- prettier-ignore -->
```css
a { top: calc(calc(1em * 2) / 3); }
```

<!-- prettier-ignore -->
```css
a {
  top: calc(var(--foo) +
    var(--bar));
}
```

<!-- prettier-ignore -->
```css
a {
  top: calc(var(--foo)
    + var(--bar));
}
```
