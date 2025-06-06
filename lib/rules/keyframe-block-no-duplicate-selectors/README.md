# keyframe-block-no-duplicate-selectors

Disallow duplicate selectors within keyframe blocks.

<!-- prettier-ignore -->
```css
@keyframes foo { 0% {} 0% {} }
/**                    ↑
 *                     This duplicate selector */
```

This rule is case-insensitive.

## Options

### `true`

```json
{
  "keyframe-block-no-duplicate-selectors": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo { 0% {} 0% {} }
```

<!-- prettier-ignore -->
```css
@keyframes foo { from {} from {} }
```

<!-- prettier-ignore -->
```css
@keyframes foo { from {} FROM {} }
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
