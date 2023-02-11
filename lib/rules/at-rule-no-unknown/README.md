# at-rule-no-unknown

Disallow unknown at-rules.

<!-- prettier-ignore -->
```css
    @unknown (max-width: 960px) {}
/** ↑
 * At-rules like this */
```

This rule considers at-rules defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@unknown {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@charset "UTF-8";
```

<!-- prettier-ignore -->
```css
@CHARSET "UTF-8";
```

<!-- prettier-ignore -->
```css
@media (max-width: 960px) {}
```

<!-- prettier-ignore -->
```css
@font-feature-values Font One {
  @styleset {}
}
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
@--my-at-rule "x.css";
```

<!-- prettier-ignore -->
```css
@--my-other-at-rule {}
```

<!-- prettier-ignore -->
```css
@--custom {}
```
