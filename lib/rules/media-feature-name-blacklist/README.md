# media-feature-name-blacklist

Specify a blacklist of disallowed media feature names.

```css
@media (min-width: 700px) {}
/**     ↑
 * This media feature name */
```

## Options

`array|string|regex`: `["array", "of", "unprefixed", /media-features/ or "regex"]|"media-feature"|/regex/`

Given:

```js
["max-width", "/^my-/"]
```

The following patterns are considered violations:

```css
@media (max-width: 50em) {}
```

```css
@media (my-width: 50em) {}
```

```css
@media (max-width < 50em) {}
```

```css
@media (10em < my-height < 50em) {}
```

The following patterns are *not* considered violations:

```css
@media (min-width: 50em) {}
```

```css
@media print and (min-resolution: 300dpi) {}
```

```css
@media (min-width >= 50em) {}
```

```css
@media (10em < width < 50em) {}
```
