# unit-no-unknown

Disallow unknown units.

<!-- prettier-ignore -->
```css
a { width: 100pixels; }
/**           ↑
 *  These units */
```

This rule considers units defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

This rule overlaps with:

- [`at-rule-descriptor-value-no-unknown`](../at-rule-descriptor-value-no-unknown/README.md)
- [`at-rule-prelude-no-invalid`](../at-rule-prelude-no-invalid/README.md)
- [`declaration-property-value-no-unknown`](../declaration-property-value-no-unknown/README.md)
- [`media-feature-name-value-no-unknown`](../media-feature-name-value-no-unknown/README.md)
- [`media-query-no-invalid`](../media-query-no-invalid/README.md)

We recommend using these rules for CSS and this rule for CSS-like languages, such as SCSS and Less.

## Options

### `true`

```json
{
  "unit-no-unknown": true
}
```

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

### `ignoreUnits`

```json
{ "ignoreUnits": ["array", "of", "units", "/regex/"] }
```

Given:

```json
{
  "unit-no-unknown": [true, { "ignoreUnits": ["/^--foo-/", "--bar"] }]
}
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

### `ignoreFunctions`

```json
{ "ignoreFunctions": ["array", "of", "functions", "/regex/"] }
```

Given:

```json
{
  "unit-no-unknown": [
    true,
    { "ignoreFunctions": ["foo", "/^my-/", "/^YOUR-/i"] }
  ]
}
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
