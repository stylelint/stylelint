# selector-combinator-space

Require or disallow a space before and/or after the combinator of selectors.

```css
    a > b + c ~ d e { color: pink; }
/**   ↑   ↑   ↑  ↑ 
 * These are combinators */
```

Combinators are used to combine several different selectors into new and more specific ones. There are several types of combinators, including: child (`>`), adjacent sibling (`+`), general sibling (`~`), and descendant (which is represented by a blank space between two selectors). The descendent combinator is *not* applicable to this rule.

## Options

`object`: `{ before: "always"|"never", after: "always"|"never" }`

### `{ before: "always" }`

There *must always* be a single space before the combinator, but *any whitespace can* come after it.

The following patterns are considered warnings:

```css
a+ b { color: pink; }
```

```css
a>b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a + b { color: pink; }
```

```css
a >b { color: pink; }
```

### `{ before: "never" }`

There *must never* be whitespace before the combinator, but *any whitespace can* come after it.

The following patterns are considered warnings:

```css
a + b { color: pink; }
```

```css
a >b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a+ b { color: pink; }
```

```css
a>b { color: pink; }
```

### `{ after: "always" }`

There *must always* be a single space after the combinator, but *any whitespace can* come before it.

The following patterns are considered warnings:

```css
a +b { color: pink; }
```

```css
a>b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a + b { color: pink; }
```

```css
a> b { color: pink; }
```

### `{ after: "never" }`

There *must never* be whitespace after the combinator, but *any whitespace can* come before it.

The following patterns are considered warnings:

```css
a + b { color: pink; }
```

```css
a> b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a +b { color: pink; }
```

```css
a>b { color: pink; }
```

### `{ before: "always", after: "always" }`

There *must always* be a single space before and after the combinator.

The following patterns are considered warnings:

```css
a+b { color: pink; }
```

```css
a> b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a + b { color: pink; }
```

### `{ before: "never", after: "never" }`

There *must never* be any whitespace before and after the combinator.

The following patterns are considered warnings:

```css
a + b { color: pink; }
```

```css
a> b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a+b { color: pink; }
```

### `{ before: "always", after: "never" }`

There *must always* be a single space before the combinator and there *must never* be any whitespace after the combinator.

The following patterns are considered warnings:

```css
a + b { color: pink; }
```

```css
a> b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a +b { color: pink; }
```

### `{ before: "never", after: "always" }`

There *must never* be any whitespace before the combinator and there *must always* be a single space after the combinator.

The following patterns are considered warnings:

```css
a + b { color: pink; }
```

```css
a>b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a> b { color: pink; }
```
