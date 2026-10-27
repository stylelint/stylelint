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

You can use this rule to avoid `!important` that has no effect. Some browsers [ignore it completely within keyframe declarations](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@keyframes#!important_in_a_keyframe).

This rule doesn't have any [message arguments](../../../docs/user-guide/configure.md#message).

## Options

### `true`

```json
{
  "keyframe-declaration-no-important": true
}
```

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
