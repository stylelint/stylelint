<!-- media-prefers-reduced-motion -->

# media-prefers-reduced-motion

Require certain styles if the animation or transition in media features.

Safari 10.1 [introduced](https://webkit.org/blog/7551/responsive-design-for-motion/) the Reduced Motion Media Query. It is a non-vendor-prefixed declaration that allows developers to "create styles that avoid large areas of motion for users that specify a preference for reduced motion in System Preferences."

## Options

### true

The following pattern are considered violations:

```css
    .foo { transition: none }
```

```css
    .bar { animation: none } .baz { transition: none } @media screen and (prefers-reduced-motion) { .baz { transition: none } }
```

```css
    .foo { animation: none } @media screen and (prefers-reduced-motion) { .foo { transition: none } }
```

The following patterns are *not* considered violations:

```css
    .foo { transition: none } @media screen and (prefers-reduced-motion: reduce) { .foo { transition: none } }
```

```css
     .bar { animation: none } @media screen and (prefers-reduced-motion) { .bar { animation: none } }
```
