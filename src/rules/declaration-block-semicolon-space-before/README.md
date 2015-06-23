# declaration-block-semicolon-space-before

Require or disallow a space before the semicolons of rules.

```css
    a { color: pink; }
/**                ↑  
 * The space before this semicolon */
```

## Options

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There *must always* be a single space before the semicolon.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink ; }
```

```css
a { color: pink ; top: 0 ; }
```

### `"never"`

There *must never* be whitespace before the semicolon.

The following patterns are considered warnings:

```css
a { color: pink ; }
```

```css
a { color: pink ; top: 0 ; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

### `"always-single-line"`

There *must always* be a single space before the semicolon in single-line rules.

The following patterns are considered warnings:

```css
a { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink ; }
```

```css
a { color: pink; top: 0; }
```

```css
a { color: pink ; top: 0 ; }
```

### `"never-single-line"`

There *must never* be whitespace before the semicolon in single-line rules.

The following patterns are considered warnings:

```css
a { color: pink ; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; top: 0; }
```

```css
a { color: pink ; top: 0 ; }
```
