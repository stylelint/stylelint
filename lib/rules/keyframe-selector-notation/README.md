# keyframe-selector-notation

Specify keyword or percentage notation for keyframe selectors. This rule only enforces the convention for `from`, `to`, `0%` and `100%`.

<!-- prettier-ignore -->
```css
@keyframes foo { from {} to {} }
/**              ↑       ↑
 *               These notations */
```

The keyword `from` is equivalent to the value `0%`. The keyword `to` is equivalent to the value `100%`.

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"keyword"|"percentage"`

### `"keyword"`

Keyframe selectors _must always_ use the keyword notation.

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
