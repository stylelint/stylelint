# function-calc-no-unspaced-operator

Disallow invalid unspaced operator within `calc` functions.

<!-- prettier-ignore -->
```css
a { top: calc(1px + 2px); }
/**               ↑
 * The space around this operator */
```

This rule checks that there is a single whitespace or a newline plus indentation before the `+` or `-` operator, and a single whitespace or a newline after that operator.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { top: calc(1px+2px); }
```

<!-- prettier-ignore -->
```css
a { top: calc(1px+ 2px); }
```

The following patterns are _not_ considered problems:

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
a { top: calc(calc(1em*2)/3); }
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
