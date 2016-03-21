# at-rule-semicolon-newline-after

Require a newline after the semicolon of at-rules.

```css
a {}

@import url("x.css");
@import url("y.css");
/**                 ↑
 * The newline after these semicolons */
```

This rule allows an end-of-line comment separated from the semicolon by spaces, as long as the comment contains no newlines. For example,

```css
@import url("x.css"); /* end-of-line comment */
```

## Options

`string`: `"always"`

### `"always"`

There *must always* be a newline after the semicolon.

The following patterns are considered warnings:

```css
@import url("x.css"); @import url("y.css");
```

```css
@import url("x.css"); a {};
```

The following patterns are *not* considered warnings:

```css
@import url("x.css");
@import url("y.css");
```

```css
@import url("x.css"); /* end-of-line comment */
a {};
```

```css
@import url("x.css");

a {};
```
