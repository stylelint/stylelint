# keyframe-block-no-duplicate-selectors

Disallow duplicate selectors within keyframe blocks.

<!-- prettier-ignore -->
```css
@keyframes foo {
  0% {}
  0% {}  /* This duplicated selector */
  100% {}
}
```

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo { 0% {} 0% {} 100% {} }
```

<!-- prettier-ignore -->
```css
@keyframes foo { 0% {} 0%, 100% {} }
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
