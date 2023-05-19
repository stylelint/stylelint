# unit-no-unknown

Disallow unknown units.

<!-- prettier-ignore -->
```css
a { width: 100pixels; }
/**           ↑
 *  These units */
```

This rule considers units defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 10pixels;
}
```

<!-- prettier-ignore -->
```css
a {
  width: calc(10px + 10pixels);
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 10px;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10Px;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10pX;
}
```

<!-- prettier-ignore -->
```css
a {
  width: calc(10px + 10px);
}
```

## Optional secondary options

### `ignoreUnits: ["/regex/", /regex/, "string"]`

Given:

```json
["/^--foo-/", "--bar"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 10--foo--baz;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10--bar;
}
```

### `ignoreFunctions: ["/regex/", /regex/, "string"]`

Given:

```json
["foo", "/^my-/", "/^YOUR-/i"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  width: foo(1x);
}
```

<!-- prettier-ignore -->
```css
a {
  width: my-func(1x);
}
```

<!-- prettier-ignore -->
```css
a {
  width: YoUr-func(1x);
}
```
