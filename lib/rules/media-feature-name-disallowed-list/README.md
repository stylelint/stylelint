# media-feature-name-disallowed-list

Specify a list of disallowed media feature names.

<!-- prettier-ignore -->
```css
@media (min-width: 700px) {}
/**     ↑
 * This media feature name */
```

Use this rule to enforce a convention. For example, disallow:

- `max-width`, so that queries stay mobile-first
- `/device-/`, as those features [measure the device rather than the viewport](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/device-width)

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the disallowed media feature name.

## Options

### `Array<string>`

```json
["array", "of", "media-features", "/regex/"]
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
