# at-rule-name-space-after

Require a single space or disallow whitespace after at-rule names.

```css
@media (max-width: 600px) {}
/**   ↑
 * The space after at-rules */
```

## Options

`string`: `"always"|"always-single-line"`

### `"always"`

There *must always* be a single space after at-rules.

The following patterns are considered warnings:

```css

```

The following patterns are *not* considered warnings:

```css
```

### `"always-single-line"`

There *must always* be a single space after at-rules in single-line declaration blocks.

The following patterns are considered warnings:

```css
```

The following patterns are *not* considered warnings:

```css
```
