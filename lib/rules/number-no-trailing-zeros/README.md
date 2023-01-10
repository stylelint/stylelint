# number-no-trailing-zeros

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Disallow trailing zeros in numbers.

<!-- prettier-ignore -->
```css
a { top: 0.5000px; bottom: 1.0px; }
/**         ↑                ↑
 *        These trailing zeros */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { top: 1.0px }
```

<!-- prettier-ignore -->
```css
a { top: 1.01000px }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: 1px }
```

<!-- prettier-ignore -->
```css
a { top: 1.01px }
```
