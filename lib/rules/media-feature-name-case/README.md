# media-feature-name-case

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Specify lowercase or uppercase for media feature names.

<!-- prettier-ignore -->
```css
@media (min-width: 700px) {}
/**     ↑
 * This media feature name */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (MIN-WIDTH: 700px) {}
```

<!-- prettier-ignore -->
```css
@media not all and (MONOCHROME) {}
```

<!-- prettier-ignore -->
```css
@media (min-width: 700px) and (ORIENTATION: landscape) {}
```

<!-- prettier-ignore -->
```css
@media (WIDTH > 10em) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (min-width: 700px) {}
```

<!-- prettier-ignore -->
```css
@media not all and (monochrome) {}
```

<!-- prettier-ignore -->
```css
@media (min-width: 700px) and (orientation: landscape) {}
```

<!-- prettier-ignore -->
```css
@media (width > 10em) {}
```

### `"upper"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (min-width: 700px) {}
```

<!-- prettier-ignore -->
```css
@media not all and (monochrome) {}
```

<!-- prettier-ignore -->
```css
@media (MIN-WIDTH: 700px) and (orientation: landscape) {}
```

<!-- prettier-ignore -->
```css
@media (10em < width <= 50em) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (MIN-WIDTH: 700px) {}
```

<!-- prettier-ignore -->
```css
@media not all and (MONOCHROME) {}
```

<!-- prettier-ignore -->
```css
@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) {}
```

<!-- prettier-ignore -->
```css
@media (10em < WIDTH <= 50em) {}
```
