# media-feature-range-notation

Media features of the range type can be written using prefixes or the more modern context notation.

<!-- prettier-ignore -->
```css
@media screen and (500px <= width <= 1200px) {}

```

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"prefix"|"context"`
