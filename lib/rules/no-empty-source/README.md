# no-empty-source

Disallow empty sources.

<!-- prettier-ignore -->
```css

```

A source containing only whitespace, e.g., spaces, tabs, or newlines, is considered empty.

## Options

### `true`

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}
```

<!-- prettier-ignore -->
```css
/* Only comments */
```
