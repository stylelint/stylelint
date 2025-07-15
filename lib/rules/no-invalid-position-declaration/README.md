# no-invalid-position-declaration

Disallow invalid position declarations.

<!-- prettier-ignore -->
```css
color: red;
/**
 * This declaration */
```

Declarations can only be positioned within the `<declaration-list>`, `<declaration-rule-list>` and `<block-contents>` productions.

## Options

### `true`

```json
{
  "no-invalid-position-declaration": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
color: red;
```

<!-- prettier-ignore -->
```css
--foo: red;
```

<!-- prettier-ignore -->
```css
@media all {
  color: red;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: red; }
```

<!-- prettier-ignore -->
```css
a { --foo: red; }
```

<!-- prettier-ignore -->
```css
@media all {
  a {
    color: red;
  }
}
```
