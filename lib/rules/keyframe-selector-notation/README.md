# keyframe-selector-notation

Specify keyword or percentage notation for keyframe selectors.

<!-- prettier-ignore -->
```css
@keyframes foo { from {} to {} }
/**              ↑       ↑
 *               These notations */
```

The keyword `from` is equivalent to the value `0%`. The keyword `to` is equivalent to the value `100%`.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"keyword"`

Keyframe selectors _must always_ use the keyword notation.

```json
{
  "keyframe-selector-notation": "keyword"
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
@keyframes foo { 0% {} 100% {} }
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@keyframes foo { from {} to {} }
```

### `"percentage"`

Keyframe selectors _must always_ use the percentage notation.

```json
{
  "keyframe-selector-notation": "percentage"
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
@keyframes foo { from {} to {} }
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@keyframes foo { 0% {} 100% {} }
```

### `"percentage-unless-within-keyword-only-block"`

Keyframe selectors _must_ use the percentage notation unless within a keyword-only block.

```json
{
  "keyframe-selector-notation": "percentage-unless-within-keyword-only-block"
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
@keyframes foo { from {} 100% {} }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo { 0% {} 100% {} }
```

<!-- prettier-ignore -->
```css
@keyframes foo { from {} to {} }
```
