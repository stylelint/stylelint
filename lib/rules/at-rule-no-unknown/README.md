# at-rule-no-unknown

Disallow unknown at-rules.

<!-- prettier-ignore -->
```css
    @unknown (max-width: 960px) {}
/** ↑
 * At-rules like this */
```

This rule considers at-rules defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

For customizing syntax, see the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) section.

## Options

### `true`

```json
{
  "at-rule-no-unknown": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@unknown {}
```

The following patterns are _not_ considered problems:

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

### `ignoreAtRules`

```json
{ "ignoreAtRules": ["array", "of", "at-rules", "/regex/"] }
```

Given:

```json
{
  "at-rule-no-unknown": [true, { "ignoreAtRules": ["/^--my-/", "--custom"] }]
}
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
