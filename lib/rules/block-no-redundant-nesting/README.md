# block-no-redundant-nesting

Disallow redundant nesting selectors.

<!-- prettier-ignore -->
```css
a {
  & {
/** ↑
 * This nesting selector */
    color: red;
  }
}
```

## Options

### `true`

```json
{
  "block-no-redundant-nesting": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { & { color: red; } }
```

<!-- prettier-ignore -->
```css
.foo { & { background: white; } }
```

<!-- prettier-ignore -->
```css
a {
  color: red;
  & {
    background: blue;
  }
}
```

<!-- prettier-ignore -->
```css
a { @media print { & { color: blue; } } }
```

<!-- prettier-ignore -->
```css
@scope (a) { & { color: red; } }
```

<!-- prettier-ignore -->
```css
a {
  @media all {}
  & { color: blue; }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { &:hover { color: blue; } }
```

<!-- prettier-ignore -->
```css
a { &.active { color: blue; } }
```

<!-- prettier-ignore -->
```css
a { &#id { color: blue; } }
```

<!-- prettier-ignore -->
```css
a { &[href] { color: blue; } }
```

<!-- prettier-ignore -->
```css
a { & span { color: blue; } }
```

<!-- prettier-ignore -->
```css
a { & > span { color: blue; } }
```

<!-- prettier-ignore -->
```css
a { &::before { content: ""; } }
```

<!-- prettier-ignore -->
```css
.foo & { color: red; }
```
