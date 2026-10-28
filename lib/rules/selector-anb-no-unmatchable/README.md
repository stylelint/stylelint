# selector-anb-no-unmatchable

Disallow unmatchable An+B selectors.

<!-- prettier-ignore -->
```css
a:nth-child(0n+0) {}
/*↑             ↑
 * This unmatchable An+B selector */
```

Use this rule to avoid selectors that never match. An `An+B` argument that always evaluates to `0`, e.g. `:nth-child(0n)`, matches nothing, as [`An+B` is one-indexed](https://www.w3.org/TR/css-syntax-3/#anb-microsyntax).

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the unmatchable selector.

## Options

### `true`

```json
{
  "selector-anb-no-unmatchable": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:nth-child(0) {}
```

<!-- prettier-ignore -->
```css
a:nth-last-child(0n) {}
```

<!-- prettier-ignore -->
```css
a:nth-of-type(0n+0) {}
```

<!-- prettier-ignore -->
```css
a:nth-last-of-type(0 of a) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:nth-child(1) {}
```

<!-- prettier-ignore -->
```css
a:nth-last-child(1n) {}
```

<!-- prettier-ignore -->
```css
a:nth-of-type(1n+0) {}
```

<!-- prettier-ignore -->
```css
a:nth-last-of-type(1 of a) {}
```
