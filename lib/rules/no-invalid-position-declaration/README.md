# no-invalid-position-declaration

Disallow invalid position declarations.

<!-- prettier-ignore -->
```css
color: red;
/** ↑
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

<!-- prettier-ignore -->
```css
a {
  @media all {
    color: red;
  }
}
```

## Optional secondary options

### `ignoreAtRules`

```json
{ "ignoreAtRules": ["array", "of", "at-rules", "/regex/"] }
```

Ignore nesting at-rules within specified at-rules.

Given:

```json
{
  "no-invalid-position-declaration": [
    true,
    { "ignoreAtRules": ["--foo", "/^--bar-/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@--foo {
  @media all {
    color: red;
  }
}
```

<!-- prettier-ignore -->
```css
@--bar-baz qux {
  @layer foo {
    color: red;
  }
}
```
