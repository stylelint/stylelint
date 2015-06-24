# at-rule-empty-line-before

Require or disallow an empty line before @rules.

```css
    a {}
              /* ← */
    @media {} /* ↑ */
/**              ↑  
 *       This line */
```

If the at-rule is the very first node in a stylesheet then it is ignored.

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

## Optional options

### `except: ["blockless-group"]`

Reverse the primary option for at-rules within a blockless group. 

For example, with `"always"`:

The following patterns are considered warnings:

```css
@import url(x.css);

@import url(y.css);

@media print {}
```

The following patterns are *not* considered warnings:

```css
@import url(x.css);
@import url(y.css);

@media print {}
```
