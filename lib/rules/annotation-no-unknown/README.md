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

The following patterns is considered a problem:

<!-- prettier-ignore -->
```css
a {
  color: green !imprtant;
}
```

The following pattern is _not_ considered problem:

<!-- prettier-ignore -->
```css
a {
 color: green !important;
}
```

<!-- prettier-ignore -->
```css
a {
  color: green !IMPORTANT;
}
```

<!-- prettier-ignore -->
```css
a {
  color: green !ImPoRtAnT;
}
```

## Optional secondary options

### `ignoreAnnotations: ["/regex/", /regex/, "string"]`

Given:

```json
["/^!my-/", "!custom"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: green !custom;
}
```

<!-- prettier-ignore -->
```css
a {
  color: green !my-custom-annotation;
}
```
