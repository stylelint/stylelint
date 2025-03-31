# selector-not-notation

Enforce simple or complex notation for `:not()` pseudo-classes.

<!-- prettier-ignore -->
```css
a:not([href]):not([class]) {}
/**        ↑              ↑
 * These :not() pseudo-classes */
```

This rule ensures consistency in how `:not()` pseudo-class selectors are written. There are two forms:

1. **Simple notation**: Each selector appears in its own `:not()`.
2. **Complex notation**: Multiple selectors are combined in one `:not()`.

## Specificity Behavior

⚠️ **Important**: The two forms have different specificity calculations in CSS:

<!-- prettier-ignore -->
```css
/* Simple form - specificity adds up (0-2-1) */
a:not([href]):not([class]) {}

/* Complex form - takes highest specificity only (0-1-1) */
a:not([href], [class]) {}
```

**Warning:** Converting to complex notation may reduce specificity and break style overrides.

## Options

`string`: `"simple"|"complex"`

- `"simple"`: Require each selector in a separate `:not()` pseudo-class.
- `"complex"`: Require multiple selectors to be combined in a single `:not()`.

For example, with `"complex"`:

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:not([href]):not([class]) {}
```

<!-- prettier-ignore -->
```css
.foo:not(.bar):not(:hover) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:not([href], [class]) {}
```

<!-- prettier-ignore -->
```css
.foo:not(.bar, :hover) {}
```

## Optional Secondary Options

### `ignoreSpecificity: true`

Disable specificity reduction warnings.

For example, with `"complex"` and `ignoreSpecificity: true`:

The following patterns are _not_ considered problems (even if specificity changes):

<!-- prettier-ignore -->
```css
a:not([href]):not([class]) {} /* converted to 0-1-1 specificity */
```

### `ignore: ["pseudo-classes"]`

Ignore `:not()` pseudo-classes when they contain certain selectors.

For example, with `"complex"` and:

```json
{ "ignore": ["pseudo-classes"] }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:not(:hover):not(:focus) {} /* ignored */
```

<!-- prettier-ignore -->
```css
a:not([href]):not(:hover) {} /* only [href] part is checked */
```

### `ignorePseudoElements: true`

Ignore `:not()` pseudo-classes containing pseudo-elements.

For example, with `"complex"` and `ignorePseudoElements: true`:

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:not(::before):not(::after) {} /* ignored */
```

## Real-world Example

This rule caught an issue where converting Bootstrap's:

<!-- prettier-ignore -->
```css
a:not([href]):not([class]) { color: inherit; } /* specificity 0-2-1 */
```

to:

<!-- prettier-ignore -->
```css
a:not([href], [class]) { color: inherit; } /* specificity 0-1-1 */
```

resulted in broken styles due to reduced specificity. Developers should carefully evaluate specificity changes before modifying selector notation.

