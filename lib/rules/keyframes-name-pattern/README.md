# keyframes-name-pattern

Specify a pattern for keyframe names.

<!-- prettier-ignore -->
```css
@keyframes slide-right {}
/**             ↑
 * The pattern of this */
```

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

Given:

```json
{
  "keyframes-name-pattern": "foo-.+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo {}
```

<!-- prettier-ignore -->
```css
@keyframes bar {}
```

<!-- prettier-ignore -->
```css
@keyframes FOO-bar {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo-bar {}
```
