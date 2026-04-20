# selector-no-invalid

Disallow invalid selectors.

<!-- prettier-ignore -->
```css
a ) b {}
/* ↑
 * Selectors like this */
```

This rule considers selectors defined within the CSS specifications, up to and including Editor's Drafts, to be valid.

> [!WARNING]
> This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as SCSS or Less.

## Options

### `true`

```json
{
  "selector-no-invalid": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a ) b {}
```

<!-- prettier-ignore -->
```css
:nth-child(2n+) {}
```

<!-- prettier-ignore -->
```css
[0foo] {}
```

<!-- prettier-ignore -->
```css
:dir(foo) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a b {}
```

<!-- prettier-ignore -->
```css
:nth-child(2n+1) {}
```

<!-- prettier-ignore -->
```css
[foo] {}
```

<!-- prettier-ignore -->
```css
:dir(ltr) {}
```
