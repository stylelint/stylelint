# selector-combinator-space-after

Require or disallow a space after the combinators of selectors.

```css
    a > b + c ~ d e { color: pink; }
/**   ↑   ↑   ↑  ↑
 * These are combinators */
```

Combinators are used to combine several different selectors into new and more specific ones. There are several types of combinators, including: child (`>`), adjacent sibling (`+`), general sibling (`~`), and descendant (which is represented by a blank space between two selectors). The descendent combinator is *not* applicable to this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space after the combinators.

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

### `"never"`

There *must never* be whitespace after the combinators.

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
