# no-invalid-position-at-import-rule

Disallow invalid position `@import` rules.

<!-- prettier-ignore -->
```css
a {}
@import 'foo.css';
/** ↑
  * This @import */
```

You can use this rule to avoid stylesheets that never load. An `@import` after other rules, except `@charset` and `@layer`, is [ignored](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@import).

This rule doesn't have any [message arguments](../../../docs/user-guide/configure.md#message).

## Options

### `true`

```json
{
  "no-invalid-position-at-import-rule": true
}
```

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
@charset "utf-8";
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@layer default;
@import url(theme.css) layer(theme);
```

## Optional secondary options

### `ignoreAtRules`

```json
{ "ignoreAtRules": ["array", "of", "at-rules", "/regex/"] }
```

Given:

```json
{
  "no-invalid-position-at-import-rule": [
    true,
    { "ignoreAtRules": ["/^--my-/", "--custom"] }
  ]
}
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
