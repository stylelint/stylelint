# media-feature-name-value-allowed-list

Specify a list of allowed media feature name and value pairs.

<!-- prettier-ignore -->
```css
@media screen and (min-width: 768px) {}
/**                ↑          ↑
 *    These features and values */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`object`: `{ "unprefixed-media-feature-name": ["array", "of", "values", "/regex/", /regex/]|"value"|"/regex/"|/regex/ }`

If a media feature name is found in the object, only its allowed-listed values are
allowed. If the media feature name is not included in the object, anything goes.

If a name or value is surrounded with `/` (e.g. `"/width$/"`), it is interpreted
as a regular expression. For example, `/width$/` will match `max-width` and `min-width`.

Given:

```json
{
  "min-width": ["768px", "1024px"],
  "/resolution/": "/dpcm$/"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (min-width: 1000px) {}
```

<!-- prettier-ignore -->
```css
@media screen and (min-resolution: 2dpi) {}
```

<!-- prettier-ignore -->
```css
@media screen and (min-width > 1000px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media screen and (min-width: 768px) {}
```

<!-- prettier-ignore -->
```css
@media screen and (min-width: 1024px) {}
```

<!-- prettier-ignore -->
```css
@media screen and (orientation: portrait) {}
```

<!-- prettier-ignore -->
```css
@media screen and (min-resolution: 2dpcm) {}
```

<!-- prettier-ignore -->
```css
@media screen and (resolution: 10dpcm) {}
```

<!-- prettier-ignore -->
```css
@media screen and (768px < min-width) {}
```
