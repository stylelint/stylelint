# media-feature-no-missing-punctuation

Ensure that non-boolean media features have the punctuation they need:
either a colon or a range-operator.

```css
@media (max-width: 600px) {}
/**              ↑
 * This punctuation */
```

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
