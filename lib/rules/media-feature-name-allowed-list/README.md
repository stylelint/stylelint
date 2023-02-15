# media-feature-name-allowed-list

Specify a list of allowed media feature names.

<!-- prettier-ignore -->
```css
@media (min-width: 700px) {}
/**     ↑
 * This media feature name */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regex`: `["array", "of", "unprefixed", /media-features/, "regex"]|"media-feature"|"/regex/"|/regex/`

Given:

```json
["max-width", "/^my-/"]
```

The following patterns are considered problems:

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
@media (min-width < 50em) {}
```

<!-- prettier-ignore -->
```css
@media (10em < min-width < 50em) {}
```

The following patterns are _not_ considered problems:

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
@media (max-width > 50em) {}
```

<!-- prettier-ignore -->
```css
@media (10em < my-width < 50em) {}
```
