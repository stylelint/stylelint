# selector-no-deprecated

Disallow deprecated selectors.

<!-- prettier-ignore -->
```css
applet {}
/** ↑
 * This selector */
```

This rule flags selectors that were removed or deprecated after being in the CSS specifications, including Editor Drafts, and were either:

- shipped in a release browser version
- shipped in a pre-release browser version
- shipped but behind feature flags
- polyfilled with some adoption before any browser shipped
- given an MDN page

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

## Options

### `true`

```json
{
  "selector-no-deprecated": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
acronym {}
```

<!-- prettier-ignore -->
```css
a:focus-ring {}
```

<!-- prettier-ignore -->
```css
.foo::shadow a {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
abbr {}
```

<!-- prettier-ignore -->
```css
a:focus-visible {}
```

## Optional secondary options

### `ignoreSelectors`

```json
{ "ignoreSelectors": ["array", "of", "selectors", "/regex/"] }
```

Given:

```json
{
  "selector-no-deprecated": [true, { "ignoreSelectors": ["contains", "/ern/"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:contains(a) {}
```

<!-- prettier-ignore -->
```css
svg hkern, vkern {}
```
