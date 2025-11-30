# block-no-redundant-nested-style-rules

Disallow redundant nested style rules within blocks.

<!-- prettier-ignore -->
```css
a { & { color: red; } }
/** ↑
 * This nested style rule */
```

## Options

### `true`

```json
{
  "block-no-redundant-nested-style-rules": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { & { color: red; } }
```

<!-- prettier-ignore -->
```css
a { @media all { & { color: red; } } }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: red; }
```

<!-- prettier-ignore -->
```css
a { @media all { color: red; } }
```

<!-- prettier-ignore -->
```css
a { &.foo { color: red; } }
```
