# no-invalid-position-declaration

Disallow invalid position declarations.

<!-- prettier-ignore -->
```css
color: red;
/**
 * This declaration */
```

Declarations must be nested inside rules and at-rules. Declarations at the root level are not valid CSS.

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
--custom-prop: red;
```

<!-- prettier-ignore -->
```css
margin: 10px;
padding: 5px;
```

<!-- prettier-ignore -->
```css
.selector { color: blue; }
margin: 10px;
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.selector { color: red; }
```

<!-- prettier-ignore -->
```css
.selector { --custom-prop: red; }
```

<!-- prettier-ignore -->
```css
:root { --custom-prop: red; }
```

<!-- prettier-ignore -->
```css
@media screen {
  color: red;
}
```

<!-- prettier-ignore -->
```css
@supports (display: grid) {
  .component { color: red; }
}
```
