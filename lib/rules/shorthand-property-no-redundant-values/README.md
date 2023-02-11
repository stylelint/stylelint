# shorthand-property-no-redundant-values

Disallow redundant values within shorthand properties.

<!-- prettier-ignore -->
```css
a { margin: 1px 1px 1px 1px; }
/**             ↑   ↑   ↑
 *           These values */
```

You can use [shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) to set multiple values at once. For example, you can use the `margin` property to set the `margin-top`, `margin-right`, `margin-bottom`, and `margin-left` properties at once.

For some shorthand properties, e.g. those related to the [edges of a box](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box), you can safely omitted some values.

This rule checks the following shorthand properties:

- `margin`
- `padding`
- `border-color`
- `border-radius`
- `border-style`
- `border-width`
- `grid-gap`

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { margin: 1px 1px; }
```

<!-- prettier-ignore -->
```css
a { margin: 1px 1px 1px 1px; }
```

<!-- prettier-ignore -->
```css
a { padding: 1px 2px 1px; }
```

<!-- prettier-ignore -->
```css
a { border-radius: 1px 2px 1px 2px; }
```

<!-- prettier-ignore -->
```css
a { -webkit-border-radius: 1px 1px 1px 1px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { margin: 1px; }
```

<!-- prettier-ignore -->
```css
a { margin: 1px 1px 1px 2px; }
```

<!-- prettier-ignore -->
```css
a { padding: 1px 1em 1pt 1pc; }
```

<!-- prettier-ignore -->
```css
a { border-radius: 10px / 5px; }
```
