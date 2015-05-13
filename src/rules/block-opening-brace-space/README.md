# block-opening-brace-space

Require or disallow a space before and/or after the opening brace of a block.

## Options

* `object`: `{ before: "always"|"never", after: "always"|"never" }`

### `{ before: "always" }`

There *must always* be a single space before the opening brace, but *any whitespace can* come after it.

The following patterns are considered warnings:

```css
a{ color: pink; }
```

```css
a{color: pink;}
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a {color: pink;}
```

### `{ before: "never" }`

There *must never* be whitespace before the opening brace, but *any whitespace can* come after it.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a {color: pink;}
```

The following patterns are *not* considered warnings:

```css
a{ color: pink; }
```

```css
a{color: pink;}
```

### `{ after: "always" }`

There *must always* be a single space after the opening brace, but *any whitespace can* come before it.

The following patterns are considered warnings:

```css
a {color: pink; }
```

```css
a{color: pink;}
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a{ color: pink; }
```

### `{ after: "never" }`

There *must never* be whitespace after the opening brace, but *any whitespace can* come before it.

The following patterns are considered warnings:

```css
a { color: pink; }
```

```css
a{ color: pink; }
```

The following patterns are *not* considered warnings:

```css
a {color: pink;}
```

```css
a{color: pink;}
```

### `{ before: "always", after: "always" }`

There *must always* be a single space before and after the opening brace.

The following patterns are considered warnings:

```css
a{ color: pink; }
```

```css
a{color: pink;}
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

### `{ before: "never", after: "never" }`

There *must never* be any whitespace before and after the opening brace.

The following patterns are considered warnings:

```css
a{ color: pink; }
```

```css
a {color: pink;}
```

The following patterns are *not* considered warnings:

```css
a{color: pink;}
```

### `{ before: "always", after: "never" }`

There *must always* be a single space before the opening brace and there *must never* be any whitespace after the opening brace.

The following patterns are considered warnings:

```css
a{ color: pink; }
```

```css
a {color: pink;}
```

The following patterns are *not* considered warnings:

```css
a {color: pink;}
```

### `{ before: "never", after: "always" }`

There *must never* be any whitespace before the opening brace and there *must always* be a single space after the opening brace

The following patterns are considered warnings:

```css
a {color: pink;}
```

```css
a { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a{ color: pink; }
```
