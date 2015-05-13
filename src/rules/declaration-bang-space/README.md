# declaration-bang-space

Require or disallow a space before and/or after the bang within declarations.

## Options

* `object`: `{ before: "always"|"never", after: "always"|"never" }`

### `{ before: "always" }`

There *must always* be a single space before the bang, but *any whitespace can* come after it.

The following patterns are considered warnings:

```css
a { color: pink!important; }
```

```css
a { color: pink   ! important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink !important; }
```

```css
a { color:pink  ! important; }
```

### `{ before: "never" }`

There *must never* be whitespace before the bang, but *any whitespace can* come after it.

The following patterns are considered warnings:

```css
a { color : pink !important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink!important; }
```

```css
a { color: pink! important; }
```

### `{ after: "always" }`

There *must always* be a single space after the bang, but *any whitespace can* come before it.

The following patterns are considered warnings:

```css
a { color: pink !important; }
```

```css
a { color: pink      !important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink ! important; }
```

```css
a { color: pink! important; }
```

### `{ after: "never" }`

There *must never* be whitespace after the bang, but *any whitespace can* come before it.

The following patterns are considered warnings:

```css
a { color: pink ! important; }
```

```css
a { color: pink! important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink !important; }
```

```css
a { color:pink!important; }
```

### `{ before: "always", after: "always" }`

There *must always* be a single space before and after the bang.

The following patterns are considered warnings:

```css
a { color: pink !important; }
```

```css
a { color: pink!important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink ! important; }
```

### `{ before: "never", after: "never" }`

There *must never* be any whitespace and before the bang.

The following patterns are considered warnings:

```css
a { color: pink !important; }
```

```css
a { color: pink!important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink ! important; }
```

### `{ before: "always", after: "never" }`

There *must always* be a single space before the bang and there *must never* be any whitespace after the bang.

The following patterns are considered warnings:

```css
a { color: pink ! important; }
```

```css
a { color: pink!important; }
```

The following patterns are *not* considered warnings:

```css
a { color:pink !important; }
```

### `{ before: "never", after: "always" }`

There *must never* be any whitespace before the bang and there *must always* be a single space after the bang.

The following patterns are considered warnings:

```css
a { color: pink !important; }
```

```css
a { color: pink!important; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink! important; }
```
