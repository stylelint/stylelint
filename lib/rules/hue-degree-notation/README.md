# hue-degree-notation

Specify number or angle notation for degree hues.

<!-- prettier-ignore -->
```css
    a { color: hsl(198deg 28% 50%) }
/**                ↑
 *                 This notation */
```

Because hues are so often given in degrees, a hue can also be given as a number, which is interpreted as a number of degrees.

This rule supports [CSS relative color syntax](https://drafts.csswg.org/css-color-5/#relative-colors), correctly identifying hue values in colors created with the `from` keyword.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"angle"`

Degree hues _must always_ use angle notation.

```json
{
  "hue-degree-notation": "angle"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: hsl(198 28% 50%) }
```

<!-- prettier-ignore -->
```css
a { color: lch(56.29% 19.86 10 / 15%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: hsl(198deg 28% 50%) }
```

<!-- prettier-ignore -->
```css
a { color: lch(56.29% 19.86 10deg / 15%) }
```

<!-- prettier-ignore -->
```css
a { color: oklch(from blue l c 180deg) }
```

### `"number"`

Degree hues _must always_ use the number notation.

```json
{
  "hue-degree-notation": "number"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: hsl(198deg 28% 50%) }
```

<!-- prettier-ignore -->
```css
a { color: lch(56.29% 19.86 10deg / 15%) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: hsl(198 28% 50%) }
```

<!-- prettier-ignore -->
```css
a { color: lch(56.29% 19.86 10 / 15%) }
```
