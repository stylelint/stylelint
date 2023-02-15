# selector-not-notation

Specify simple or complex notation for `:not()` pseudo-class selectors.

<!-- prettier-ignore -->
```css
    a:not(.foo, .bar) {}
/**  ↑
 * This notation */
```

In Selectors Level 3, only a single _simple selector_ was allowed as the argument to `:not()`, whereas Selectors Level 4 allows a _selector list_.

Use:

- `"complex"` to author modern Selectors Level 4 CSS
- `"simple"` for backwards compatibility with older browsers

The [`fix` option](../../../docs/user-guide/options.md#fix) option can automatically fix most of the problems reported by this rule.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`string`: `"simple"|"complex"`

### `"simple"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
:not(a, div) {}
```

<!-- prettier-ignore -->
```css
:not(a.foo) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:not(a):not(div) {}
```

<!-- prettier-ignore -->
```css
:not(a) {}
```

### `"complex"`

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
:not(a):not(div) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:not(a, div) {}
```

<!-- prettier-ignore -->
```css
:not(a.foo) {}
```

<!-- prettier-ignore -->
```css
:not(a).foo:not(:empty) {}
```
