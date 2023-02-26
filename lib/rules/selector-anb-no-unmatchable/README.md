# selector-anb-no-unmatchable

Disallow unmatchable An+B selectors.

<!-- prettier-ignore -->
```css
a:nth-child(0n+0) {}
/*↑             ↑
 * This unmatchable An+B selector */
```

[An+B selectors](https://www.w3.org/TR/css-syntax-3/#anb-microsyntax) are one-indexed. Selectors that always evaluate to `0` will not match any elements.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

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
