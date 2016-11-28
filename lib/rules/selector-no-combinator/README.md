# selector-no-combinator

Disallow combinators in selectors.

```css
  a > b + c ~ d e { color: pink; }
/** ↑   ↑   ↑  ↑
 * These are combinators */
```

Combinators are used to combine several different selectors into new and more specific ones. There are several types of combinators, including: child (`>`), adjacent sibling (`+`), general sibling (`~`), and descendant (which is represented by a blank space between two selectors).

## Options

### `true`

The following patterns are considered warnings:

```css
a b { color: pink; }
```

```css
a > b { color: pink; }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a, b { color: pink; }
```

```css
a.foo { color: pink; }
```
