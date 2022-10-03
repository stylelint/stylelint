# no-invalid-position-at-import-rule

Disallow invalid position `@import` rules.

<!-- prettier-ignore -->
```css
a {}
@import 'foo.css';
/** ↑
  * This @import */
```

Any `@import` rules must precede all other valid at-rules and style rules in a stylesheet (ignoring `@charset` and `@layer`), or else the `@import` rule is invalid.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {}
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@media print {}
@import 'foo.css';
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import 'foo.css';
a {}
```

<!-- prettier-ignore -->
```css
/* some comment */
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@charset 'utf-8';
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@layer default;
@import url(theme.css) layer(theme);
```

## Optional secondary options

### `ignoreAtRules: ["/regex/", /regex/, "string"]`

Given:

```json
["/^--my-/", "--custom"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@--my-at-rule "bar.css";
@import "foo.css";
```

<!-- prettier-ignore -->
```css
@--my-other-at-rule {}
@import "foo.css";
```

<!-- prettier-ignore -->
```css
@--custom "bar.css";
@import "foo.css"
```
