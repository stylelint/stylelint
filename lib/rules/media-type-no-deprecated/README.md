# media-type-no-deprecated

Disallow deprecated media types.

<!-- prettier-ignore -->
```css
    @media tv {}
/**        ↑
 * Deprecated media type */
```

Several CSS media types defined in earlier specifications have been deprecated and should no longer be used. According to the CSS [media queries specification](https://drafts.csswg.org/mediaqueries-5/#media-types), the following media types are recognized as valid but match nothing:

- `aural`
- `braille`
- `embossed`
- `handheld`
- `projection`
- `speech`
- `tty`
- `tv`

Currently, the recommended media types are:

- `all`
- `screen`
- `print`

The deprecated media types were removed because they were either never widely implemented or their use cases are now better handled by media features rather than broad device categories.

## Options

### `true`

```json
{
  "media-type-no-deprecated": true
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
@media tty {}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@media screen {}
```

## Optional secondary options

### `ignoreMediaTypes`

```json
{ "ignoreMediaTypes": ["array", "of", "types", "/regex/"] }
```

Ignore the specified media types.

Given:

```json
{
  "media-type-no-deprecated": [true, { "ignoreMediaTypes": ["/^t/", "speech"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media tv {}
```

<!-- prettier-ignore -->
```css
@media tty {}
```

<!-- prettier-ignore -->
```css
@media speech {}
```
