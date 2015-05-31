# rule-set-non-nested-empty-line-before

Require or disallow an empty line before a non-nested rule-set.

```css
    a {}
          /* ← */
    b {}  /* ↑ */
/**          ↑  
 *   This line */
```

## Options

`string`: `"always"|"never"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be an empty line before rules.

The following patterns are considered warnings:

```css
a {} b {}
```

```css
a {}
b {}
```

The following patterns are *not* considered warnings:

```css
a {}

b {}
```

### `"never"`

There *must never* be an empty before rules.

The following patterns are considered warnings:

```css
a {}

b {}
```

The following patterns are *not* considered warnings:

```css
a {} b {}
```

```css
a {} 
b {}
```

### `"always-multi-line"`

There *must always* be an empty line before multi-line rules.

The following patterns are considered warnings:

```css
a 
{} 
b 
{}
```

The following patterns are *not* considered warnings:

```css
a 
{}

b 
{}
```

### `"never-multi-line"`

There *must never* be an empty line before multi-line rules.

The following patterns are considered warnings:

```css
a 
{}

b 
{}
```

The following patterns are *not* considered warnings:

```css
a 
{} 
b 
{}
```

