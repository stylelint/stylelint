# no-empty-source

Disallow empty sources.

<!-- prettier-ignore -->
```css
  ···\n\t
/**     ↑
 *  This empty source */
```

A source containing only whitespace is considered empty.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css

```

<!-- prettier-ignore -->
```css
\t\t
```

<!-- prettier-ignore -->
```css
\n
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}
```

<!-- prettier-ignore -->
```css
/* Only comments */
```
