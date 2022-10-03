# keyframe-declaration-no-important

Disallow invalid `!important` within keyframe declarations.

<!-- prettier-ignore -->
```css
@keyframes foo {
  from { opacity: 0 }
  to { opacity: 1 !important }
}              /* ↑ */
/**               ↑
*   This !important */
```

Using `!important` within keyframes declarations is [completely ignored in some browsers](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes#!important_in_a_keyframe).

## Options

### `true`

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
@keyframes foo {
  from {
    opacity: 0;
  }
  to {
    opacity: 1 !important;
  }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@keyframes foo {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

<!-- prettier-ignore -->
```css
a { color: pink !important; }
```
