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

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media tty {}
```

The following patterns are _not_ considered problems:

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

```
tty
tv
projection
handheld
braille
embossed
aural
speech
```

For more details, see the [Media Types](https://drafts.csswg.org/mediaqueries/#media-types) section.
