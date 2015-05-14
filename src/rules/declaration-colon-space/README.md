# declaration-colon-space

Require or disallow a space before and/or after the colon within declarations.

```css
    a { color: pink; }
/**          ↑
 * The space around this colon */
```

## Options

`object`: `{ before: "always"|"never", after: "always"|"never" }`

### `{ before: "always" }`

There *must always* be a single space before the colon, but *any whitespace can* come after it.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a { color:pink; }
```

```css
a { color      : pink; /* multiple spaces before */ }
```

```css
a { color  :pink; /* tab before */ }
```

The following patterns are *not* considered warnings:

```css
a { color : pink; }
```

```css
a { color :pink; }
```

```css
a { color :    pink; /* multiple spaces after */ }
```

### `{ before: "never" }`

There *must never* be whitespace before the colon, but *any whitespace can* come after it.

The following patterns are considered warnings:

```css
a { color : pink; }
```

```css
a { color      :pink; /* multiple spaces */ }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { color:pink; }
```

### `{ after: "always" }`

There *must always* be a single space after the colon, but *any whitespace can* come before it.

The following patterns are considered warnings:

```css
a { color :pink; }
```

```css
a { color:pink; }
```

The following patterns are *not* considered warnings:

```css
a { color : pink; }
```

```css
a { color: pink; }
```

### `{ after: "never" }`

There *must never* be whitespace after the colon, but *any whitespace can* come before it.

The following patterns are considered warnings:

```css
a { color : pink; }
```

```css
a { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a { color:pink; }
```

```css
a { color :pink; }
```

### `{ before: "always", after: "always" }`

There *must always* be a single space before and after the colon.

The following patterns are considered warnings:

```css
a { color:pink; }
```

```css
a { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a { color : pink; }
```

### `{ before: "never", after: "never" }`

There *must never* be any whitespace and before the colon.

The following patterns are considered warnings:

```css
a { color : pink; }
```

```css
a { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a { color:pink; }
```

### `{ before: "always", after: "never" }`

There *must always* be a single space before the colon and there *must never* be any whitespace after the colon.

The following patterns are considered warnings:

```css
a { color : pink; }
```

```css
a { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a { color :pink; }
```

### `{ before: "never", after: "always" }`

There *must never* be any whitespace before the colon and there *must always* be a single space after the colon

The following patterns are considered warnings:

```css
a { color : pink; }
```

```css
a { color:pink; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```


