# property-disallowed-list

Specify a list of disallowed properties.

<!-- prettier-ignore -->
```css
a { text-rendering: optimizeLegibility; }
/** ↑
 * This property */
```

This rule ignores preprocessor variables (e.g. `$sass`, `@less`).

## Options

### `Array<string>`

```json
["array", "of", "properties", "/regex/"]
```

Given:

```json
{
  "property-disallowed-list": [
    "text-rendering",
    "animation",
    "/^background/",
    "--foo"
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { text-rendering: optimizeLegibility; }
```

<!-- prettier-ignore -->
```css
a {
  animation: my-animation 2s;
}
```

<!-- prettier-ignore -->
```css
a {
  --foo: red;
}
```

<!-- prettier-ignore -->
```css
a { -webkit-animation: my-animation 2s; }
```

<!-- prettier-ignore -->
```css
a { background: red; }
```

<!-- prettier-ignore -->
```css
a { background-size: cover; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: red; }
```

<!-- prettier-ignore -->
```css
a { no-background: sure; }
```

<!-- prettier-ignore -->
```css
a {
  --bar: red;
}
```
