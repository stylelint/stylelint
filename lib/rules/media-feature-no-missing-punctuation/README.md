# media-feature-no-missing-punctuation

***Deprecated: See [CHANGELOG](../../../CHANGELOG.md).***

Disallow missing punctuation for non-boolean media features.

```css
@media (max-width: 600px) {}
/**              ↑
 * This punctuation */
```

This rule ensures that there is either a colon or a range operator in non-boolean media features.

## Options

### `true`

The following patterns are considered violations:

```css
@media (max-width 600px) {}
```

```css
@media (width   20em) {}
```

The following patterns are *not* considered violations:

```css
@media (max-width: 600px) {}
```

```css
@media (width  >=  20em) {}
```
