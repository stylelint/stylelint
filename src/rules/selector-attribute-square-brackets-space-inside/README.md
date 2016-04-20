# selector-attribute-square-brackets-space-inside

Require a single space or disallow whitespace on the inside of the square brackets within selectors.

```css
.foo[ target=_blank ]
/**  ↑             ↑
 * The space inside these two square brackets */
```

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space inside the parentheses.

The following patterns are considered warnings:

```css
[target] {}
```

```css
[ target] {}
```

```css
[target ] {}
```

```css
[target=_blank] {}
```

```css
[ target=_blank] {}
```

```css
[target=_blank ] {}
```

The following patterns are *not* considered warnings:

```css
[ target ] {}
```

```css
[ target=_blank ] {}
```

### `"never"`

There *must never* be whitespace on the inside the parentheses.

The following patterns are considered warnings:

```css
[ target] {}
```

```css
[target ] {}
```

```css
[ target ] {}
```

```css
[ target=_blank] {}
```

```css
[target=_blank ] {}
```

```css
[ target=_blank ] {}
```

The following patterns are *not* considered warnings:

```css
[target] {}
```

```css
[target=_blank] {}
```
