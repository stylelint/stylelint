# declaration-no-important

Disallow `!important` within declarations.

<!-- prettier-ignore -->
```css
a { color: pink !important; }
/**             ↑
 * This !important */
```

Use this rule to enforce a convention, as [`!important`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/important) can make styles harder to override. With [cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer#description), `!important` in an earlier layer wins over later layers, which can be the intent.

If you always want `!important` in your declarations, e.g. if you're writing [user styles](https://userstyles.org/), you can _safely_ add them using [`postcss-safe-important`](https://github.com/crimx/postcss-safe-important).

This rule doesn't have any [message arguments](../../../docs/user-guide/configure.md#message).

## Options

### `true`

```json
{
  "declaration-no-important": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink !important; }
```

<!-- prettier-ignore -->
```css
a { color: pink ! important; }
```

<!-- prettier-ignore -->
```css
a { color: pink!important; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```
