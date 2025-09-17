# nesting-selector-no-missing-scoping-root

Disallow missing scoping root for nesting selectors.

<!-- prettier-ignore -->
```css
    & {}
/** ↑
 * This nesting selector */
```

CSS nesting selectors (`&`) represent the parent selector in nested CSS. When used at the top level or within certain at-rules without a scoping root, they can cause unexpected behavior or indicate a mistake in the CSS structure.

## Options

### `true`

```json
{
  "nesting-selector-no-missing-scoping-root": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
& {}
```

<!-- prettier-ignore -->
```css
@media all {
  & {}
}
```

<!-- prettier-ignore -->
```css
@scope (&) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  & {}
}
```

<!-- prettier-ignore -->
```css
a {
  @media all {
    & {}
  }
}
```

<!-- prettier-ignore -->
```css
a {
  @scope (&) {}
}
```

## Optional secondary options

### `ignoreAtRules`

```json
{ "ignoreAtRules": ["array", "of", "at-rules", "/regex/"] }
```

Ignore nesting selectors within specified at-rules.

Given:

```json
{
  "nesting-selector-no-missing-scoping-root": [
    true,
    { "ignoreAtRules": ["--foo", "/^--bar-/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@--foo {
  & {}
}
```

<!-- prettier-ignore -->
```css
@--bar-baz qux {
  & {}
}
```
