# media-feature-name-disallowed-list

Specify a list of disallowed media feature names.

<!-- prettier-ignore -->
```css
@media (min-width: 700px) {}
/**     ↑
 * This media feature name */
```

## Options

### `Array<string>`

```json
["array", "of", "unprefixed", "media-features", "/regex/"]
```

Given:

```json
{
  "media-feature-name-disallowed-list": ["max-width", "/^my-/"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (max-width: 50em) {}
```

<!-- prettier-ignore -->
```css
@media (my-width: 50em) {}
```

<!-- prettier-ignore -->
```css
@media (max-width < 50em) {}
```

<!-- prettier-ignore -->
```css
@media (10em < my-height < 50em) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (min-width: 50em) {}
```

<!-- prettier-ignore -->
```css
@media print and (min-resolution: 300dpi) {}
```

<!-- prettier-ignore -->
```css
@media (min-width >= 50em) {}
```

<!-- prettier-ignore -->
```css
@media (10em < width < 50em) {}
```
