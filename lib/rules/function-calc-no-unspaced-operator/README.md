# function-calc-no-unspaced-operator

Disallow invalid unspaced operator within [math functions](https://www.w3.org/TR/css-values-4/#calc-syntax), such as `calc()` or `min()`.

<!-- prettier-ignore -->
```css
a { top: calc(1px + 2px); }
/**               ↑
 * The space around this operator */
```

Use this rule to avoid declarations that browsers ignore. In `calc()`, `+` and `-` without surrounding whitespace are [parsed as signed numbers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/calc-sum#description), which invalidates the whole declaration.

This rule requires a single whitespace or a newline plus indentation before the `+` or `-` operator, and a single whitespace or a newline after that operator.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the operator.

## Options

### `true`

```json
{
  "function-calc-no-unspaced-operator": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { top: calc(1px+2px); }
```

<!-- prettier-ignore -->
```css
a { top: calc(1px+ 2px); }
```

<!-- prettier-ignore -->
```css
a { transform: rotate(atan(-2+1)); }
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
