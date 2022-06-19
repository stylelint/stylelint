# annotation-no-unknown

Disallow unknown annotations.

<!-- prettier-ignore -->
```css
a { color: green !imprtant; }
/**              ↑
 * This annotation */
```

This rule considers solely the `!important` annotation per the [CSS Cascading and Inheritance spec](https://www.w3.org/TR/css-cascade-3/#importance).

## Options

### `true`

The following patterns is considered a problem:

<!-- prettier-ignore -->
```css
a {
  color: green !imprtant;
}
```

The following patterns are _not_ considered problems:

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
