# keyframe-selector-notation

Specify keyword or percentage notation for keyframe selectors.

<!-- prettier-ignore -->
```css
@keyframes foo { from {} to {} }
/**              ↑       ↑
 *               These notations */
```

You can use this rule to enforce a convention. In [`@keyframes`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@keyframes), `from` and `to` are equivalent to `0%` and `100%`.

Use:

- `"keyword"` for clarity
- `"percentage"` for consistency with intermediate steps, e.g. `50%`
- `"percentage-unless-within-keyword-only-block"` for both, with `from` and `to` only in two-step animations

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the selector and its expected notation.

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
