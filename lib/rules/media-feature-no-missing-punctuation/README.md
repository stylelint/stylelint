# media-feature-no-missing-punctuation

***Deprecated: this rule is outside the scope of stylelint's functionality. See [the release planning docs](http://stylelint.io/user-guide/release-planning/) for details.***

Disallow missing punctuation for non-boolean media features.

```css
@media (max-width: 600px) {}
/**              ↑
 * This punctuation */
```

This rule ensures that there is either a colon or a range operator in non-boolean media features.

## Options

### `true`

The following patterns are considered warnings:

```css
@media (max-width 600px) {}
```

```css
@media (width   20em) {}
```

The following patterns are *not* considered warnings:

```css
@media (max-width: 600px) {}
```

```css
@media (width  >=  20em) {}
```
