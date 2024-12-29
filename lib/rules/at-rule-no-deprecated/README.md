# at-rule-no-deprecated

Disallow deprecated at-rules.

<!-- prettier-ignore -->
```css
    @document url(http://www.w3.org/);
/** ↑
 * At-rules like this */
```

This rule flags at-rules that were removed or deprecated after being in the CSS specifications, including editor drafts, and were subsequently either:

- shipped in a stable version of a browser
- shipped by a developer channel/edition browser
- shipped but behind experimental flags
- polyfilled with some adoption before any browser actually shipped
- had an MDN page at one point in time

The [`message` secondary option](../../../docs/user-guide/configure.md#message) accept arguments.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@document url("http://www.w3.org/")
```

<!-- prettier-ignore -->
```css
a { @apply foo; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@namespace svg url('http://www.w3.org/2000/svg');
```

<!-- prettier-ignore -->
```css
a { @container (min-width: 20em) {} }
```

## Optional secondary options

### `ignoreAtRules: ["/regex/", /regex/, "string"]`

Given:

```json
["/^doc/", "apply"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@document url("http://www.w3.org/")
```

<!-- prettier-ignore -->
```css
a { @apply foo; }
```
