# selector-anb-no-unmatchable

Disallow unmatchable An+B selectors.

<!-- prettier-ignore -->
```css
a:nth-child(0n+0) {}
/*↑             ↑
 * This unmatchable An+B selector */
```

[An+B selectors](https://drafts.csswg.org/css-syntax/#anb) are one-indexed. Selectors that always evaluate to `0` will not match any elements.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:nth-child(0) {}
```

<!-- prettier-ignore -->
```css
a:nth-child(0n) {}
```

<!-- prettier-ignore -->
```css
a:nth-child(0n+0) {}
```

<!-- prettier-ignore -->
```css
a:nth-child(0 of a) {}
```

<!-- prettier-ignore -->
```css
a:nth-last-child(0) {}
```

<!-- prettier-ignore -->
```css
a:nth-of-type(0) {}
```

<!-- prettier-ignore -->
```css
a:nth-last-of-type(0) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:nth-child(1) {}
```

<!-- prettier-ignore -->
```css
a:nth-child(1n) {}
```

<!-- prettier-ignore -->
```css
a:nth-child(1n+0) {}
```

<!-- prettier-ignore -->
```css
a:nth-child(0n+1) {}
```
