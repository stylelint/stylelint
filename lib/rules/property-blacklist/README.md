# property-blacklist

Specify a blacklist of disallowed properties.

```css
a { text-rendering: optimizeLegibility; }
/** ↑
 * These properties */
```

This rule removes vendor prefixes before any checks.

## Options

`array|string`

Any `string` surrounded with `"/"` (e.g. `"/^string/"`) is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^background/` will match `background`, `background-size`, `background-color`, etc.

Given:

```js
[ "text-rendering", "animation", "/^background/" ]
```

The following patterns are considered violations:

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

The following patterns are *not* considered violations:

```css
a { color: pink; }
```

```css
a { no-background: sure; }
```
