# selector-root-no-composition

***Deprecated: this rule is outside the scope of stylelint's functionality. See [the release planning docs](https://stylelint.io/user-guide/release-planning/) for details.***

Disallow the composition of `:root` in selectors.

```css
    a, :root {}
/** ↑  ↑
 * This type of composite selector */
```

## Options

### `true`

The following patterns are considered warnings:

```css
a, :root {}
```

```css
:root + a {}
```

```css
html:root {}
```

The following patterns are *not* considered warnings:

```css
:root {}
```
