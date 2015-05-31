# media-feature-range-operator-space-after

Require or disallow a space after range operator in media features.

```css
    @media (max-width >= 600px) {}
/**                    ↑  
 * The space after this */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space after the range operator.

The following patterns are considered warnings:

```css
@media (max-width>=600px) {}
```

```css
@media (max-width >=600px) {}
```

The following patterns are *not* considered warnings:

```css
@media (max-width>= 600px) {}
```

```css
@media (max-width >= 600px) {}
```

### `"never"`

There *must never* be whitespace after the range operator.

The following patterns are considered warnings:

```css
@media (max-width>= 600px) {}
```

```css
@media (max-width >= 600px) {}
```

The following patterns are *not* considered warnings:

```css
@media (max-width>=600px) {}
```

```css
@media (max-width >=600px) {}
```
