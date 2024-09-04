# no-empty-source

Disallow empty sources.

<!-- prettier-ignore -->
```css

```

A source containing only whitespace, i.e., spaces, tabs, or newlines, is considered empty.

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
