# annotation-no-unknown

Disallow unknown annotations.

<!-- prettier-ignore -->
```css
a { color: green !imprtant; }
/**              ↑
 * This annotation */
```

This rule considers annotations defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

## Options

### `true`

```json
{
  "annotation-no-unknown": true
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
a {
  color: green !imprtant;
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a {
  color: green !important;
}
```

## Optional secondary options

### `ignoreAnnotations`

```json
{ "ignoreAnnotations": ["array", "of", "annotations", "/regex/"] }
```

Given:

```json
{
  "annotation-no-unknown": [
    true,
    { "ignoreAnnotations": ["/^--foo-/", "--bar"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: green !--foo--bar;
}
```

<!-- prettier-ignore -->
```css
a {
  color: green !--bar;
}
```
