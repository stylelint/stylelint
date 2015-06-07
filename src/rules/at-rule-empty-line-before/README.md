# at-rule-empty-line-before

Require or disallow an empty line before @rules.

```css
    a {}
              /* ← */
    @media {} /* ↑ */
/**              ↑  
 *       This line */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be an empty line before @rules.

The following patterns are considered warnings:

```css
a {} @media {}
```

```css
a {}
@media {}
```

The following patterns are *not* considered warnings:

```css
a {}

@media {}
```

### `"never"`

There *must never* be an empty before @rules.

The following patterns are considered warnings:

```css
a {}

@media {}
```

The following patterns are *not* considered warnings:

```css
a {} @media {}
```

```css
a {} 
@media {}
```
