# named-grid-areas-no-invalid

Disallow invalid named grid areas.

<!-- prettier-ignore -->
```css
a { grid-template-areas: 
      "a a a"
      "b b b"; }
/**   ↑
 *  This named grid area */

## Options

### `true`

The following patterns are considered violations:

All strings must define the same number of cell tokens.

<!-- prettier-ignore -->
```css
grid-template-areas: "a a a"
                     "b b b b";
```

All strings must define at least one cell token

<!-- prettier-ignore -->
```css
grid-template-areas: ""
```

If a named grid area spans multiple grid cells, but those cells do not form a single filled-in rectangle, the declaration is invalid.

<!-- prettier-ignore -->
```css
grid-template-areas: "a a a"
                     "b b a";
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
grid-template-areas: "a a a"
                     "b b b";
```

<!-- prettier-ignore -->
```css
grid-template-areas: "a a a" "b b b";
```

<!-- prettier-ignore -->
```css
grid-template-areas: none;
```
