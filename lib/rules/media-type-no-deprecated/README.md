# media-type-no-deprecated

Disallow deprecated media types.

<!-- prettier-ignore -->
```css
    @media tv {}
/**        ↑
 * Deprecated media type */
```

## Options

### `true`

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

### `ignoreMediaType: ["/regex/", /regex/, "string"]`

Given:

```json
["/^t/", "speech"]
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

## Reference of deprecated media types

Several CSS media types defined in earlier specifications have been deprecated and should no longer be used. According to the CSS [media queries specification](https://drafts.csswg.org/mediaqueries-5/#media-types), the following media types are recognized as valid but match nothing:

- `tty`
- `tv`
- `projection`
- `handheld`
- `braille`
- `embossed`
- `aural`
- `speech`

Currently, the recommended media types are:

- `all`
- `screen`
- `print`

The deprecated media types were removed because they were either never widely implemented or their use cases are now better handled by media features rather than broad device categories.
