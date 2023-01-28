# selector-descendant-combinator-no-non-space

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Disallow non-space characters for descendant combinators of selectors.

<!-- prettier-ignore -->
```css
.foo .bar .baz {}
/** ↑    ↑
* These descendant combinators */
```

This rule ensures that only a single space is used and ensures no tabs, newlines, nor multiple spaces are used for descendant combinators of selectors.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix most of the problems reported by this rule.

This rule currently ignores selectors containing comments.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
.foo  .bar {}
```

<!-- prettier-ignore -->
```css
.foo
.bar {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.foo .bar {}
```
