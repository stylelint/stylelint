# named-grid-areas-no-invalid

Disallow invalid named grid areas.

<!-- prettier-ignore -->
```css
a { grid-template-areas:
      "a a a"
      "b b b"; }
/**   ↑
 *  This named grid area */
```

You can use this rule to avoid grids with no named areas. An invalid `grid-template-areas` value [invalidates the whole declaration](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-areas#values).

For a named grid area to be valid, all strings must define:

- the same number of cell tokens
- at least one cell token

And all named grid areas that spans multiple grid cells must form a single filled-in rectangle.

This rule supports up to 1 [message argument](../../../docs/user-guide/configure.md#message): the grid-area name.

## Options

### `true`

```json
{
  "named-grid-areas-no-invalid": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { grid-template-areas: "" }
```

<!-- prettier-ignore -->
```css
a { grid-template-areas: "a a a"
                         "b b b b"; }
```

<!-- prettier-ignore -->
```css
a { grid-template-areas: "a a a"
                         "b b a"; }
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a { grid-template-areas: "a a a"
                         "b b b"; }
```
