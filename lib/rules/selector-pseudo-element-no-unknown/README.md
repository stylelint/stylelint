# selector-pseudo-element-no-unknown

Disallow unknown pseudo-element selectors.

<!-- prettier-ignore -->
```css
  a::before {}
/**  ↑
 * This pseudo-element selector */
```

This rule considers pseudo-element selectors defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

This rule ignores vendor-prefixed pseudo-element selectors.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a::pseudo {}
```

<!-- prettier-ignore -->
```css
a::PSEUDO {}
```

<!-- prettier-ignore -->
```css
a::element {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:before {}
```

<!-- prettier-ignore -->
```css
a::before {}
```

<!-- prettier-ignore -->
```css
::selection {}
```

<!-- prettier-ignore -->
```css
input::-moz-placeholder {}
```

## Optional secondary options

### `ignorePseudoElements: ["/regex/", /regex/, "non-regex"]`

Given:

```json
["/^--my-/", "--pseudo-element"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a::--my-pseudo {}
```

<!-- prettier-ignore -->
```css
a::--my-other-pseudo {}
```

<!-- prettier-ignore -->
```css
a::--pseudo-element {}
```
