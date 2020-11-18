# dash-ident-no-missing-reference-function

Disallow missing reference functions for dashed-idents.

<!-- prettier-ignore -->
```css
    a { color: var(--foo); }
/**            ↑   ↑
 *             This function and this dashed-ident */
```

[Dashed-idents](https://drafts.csswg.org/css-values-4/#dashed-idents) are most often referenced using functions like `var()` and `env()`. This rule reports dashed-idents that are missing a reference function.

## Options

### `true`

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a { color: --foo; }
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
a { color: var(--foo); }
```

<!-- prettier-ignore -->
```css
a { color: env(--foo); }
```
