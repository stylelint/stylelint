# property-blacklist

Specify a blacklist of disallowed properties.

```css
a { text-rendering: optimizeLegibility; }
/** ↑
 * These properties */
```

## Options

`array`: `"["array", "of", "unprefixed", "properties"]`

### `["array", "of", "unprefixed", properties"]`

Blacklisted properties *must never* be used.

If a string in the array is surrounded with `"/"` (e.g. `"/^background/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^background/` will match `background`, `background-size`, `background-color`, etc.

Given:

```js
[ "text-rendering", "animation", "/^background/" ]
```

The following patterns are considered warnings:

```css
a { text-rendering: optimizeLegibility; }
```

```css
a {
  animation: my-animation 2s;
  color: pink;
}
```

```css
a { -webkit-animation: my-animation 2s; }
```

```css
a { background: pink; }
```

```css
a { background-size: cover; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { no-background: sure; }
```
