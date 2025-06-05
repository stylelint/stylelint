# media-feature-name-unit-allowed-list

Specify a list of allowed name and unit pairs within media features.

<!-- prettier-ignore -->
```css
@media (width: 50em) {}
/**     ↑         ↑
 * This media feature name and these units */
```

## Options

### `Array<string>`

```json
{ "media-feature-name": ["array", "of", "units"] }
```

You can specify a regex for a media feature name, such as `{ "/height$/": [] }`.

Given:

```json
{
  "media-feature-name-unit-allowed-list": {
    "width": "em",
    "/height/": ["em", "rem"]
  }
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (width: 50rem) {}
```

<!-- prettier-ignore -->
```css
@media (height: 1000px) {}
```

<!-- prettier-ignore -->
```css
@media (min-height: 1000px) {}
```

<!-- prettier-ignore -->
```css
@media (height <= 1000px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (width: 50em) {}
```

<!-- prettier-ignore -->
```css
@media (width <= 50em) {}
```

<!-- prettier-ignore -->
```css
@media (height: 50em) {}
```

<!-- prettier-ignore -->
```css
@media (min-height: 50rem) {}
```
