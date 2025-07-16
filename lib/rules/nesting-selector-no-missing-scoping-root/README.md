# nesting-selector-no-missing-scoping-root

Disallow missing scoping root for nesting selectors.

<!-- prettier-ignore -->
```css
& { }
/**
 * ↑
 * This nesting selector is missing a scoping root */
```

CSS nesting selectors (`&`) represent the parent selector in nested CSS. When used at the top level or within certain at-rules without a scoping root, they can cause unexpected behavior or indicate a mistake in the CSS structure.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
& { }
```

<!-- prettier-ignore -->
```css
& li { }
```

<!-- prettier-ignore -->
```css
& .foo { }
```

<!-- prettier-ignore -->
```css
&.foo { }
```

<!-- prettier-ignore -->
```css
&:hover { }
```

<!-- prettier-ignore -->
```css
@media screen {
  & { }
}
```

<!-- prettier-ignore -->
```css
@supports (color: red) {
  & { }
}
```

<!-- prettier-ignore -->
```css
@layer foo {
  & { }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.foo {
  & .bar { }
}
```

<!-- prettier-ignore -->
```css
.foo {
  & { }
}
```

<!-- prettier-ignore -->
```css
@scope (.foo) {
  & { }
}
```

<!-- prettier-ignore -->
```css
:root { }
```

<!-- prettier-ignore -->
```css
a { }
```

<!-- prettier-ignore -->
```css
:host { }
```
