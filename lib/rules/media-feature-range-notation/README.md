# media-feature-range-notation

Specify context or prefix notation for media feature ranges.

<!-- prettier-ignore -->
```css
@media (width >= 600px) and (min-width: 600px) {}
/**    ↑                    ↑
 *     These media feature notations */
```

Media features of the range type can be written using prefixes or the more modern context notation.

Because `min-` and `max-` both equate to range comparisons that include the value, they may be [limiting in certain situations](https://drafts.csswg.org/mediaqueries/#mq-min-max).

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

## Options

`string`: `"context"|"prefix"`

### `"context"`

Media feature ranges _must always_ use context notation.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (min-width: 1px) {}
```

<!-- prettier-ignore -->
```css
@media (min-width: 1px) and (max-width: 2px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (width >= 1px) {}
```

<!-- prettier-ignore -->
```css
@media (1px <= width <= 2px) {}
```

### `"prefix"`

Media feature ranges _must always_ use prefix notation.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (width >= 1px) {}
```

<!-- prettier-ignore -->
```css
@media (1px <= width <= 2px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (min-width: 1px) {}
```

<!-- prettier-ignore -->
```css
@media (min-width: 1px) and (max-width: 2px) {}
```
