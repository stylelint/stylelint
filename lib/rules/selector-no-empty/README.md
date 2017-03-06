# selector-no-empty

***Deprecated: See [CHANGELOG](../../../CHANGELOG.md).***

Disallow empty selectors.

```css
  a, , b {}
/** ↑
 * An empty selector */
```

Empty selectors (by themselves or within a selector list) invalidate a rule. This rule splits the selector list on `,`. Any part that has zero length or containing only whitespace is deemed empty.

## Options

### `true`

The following patterns are considered warnings:

```css
{}
```

```css
, .a, .b {}
```

```css
.a, .b,  {}
```

```css
.a, , .b {}
```

The following patterns are *not* considered warnings:

```css
a {}
```

```css
a, b {}
```

```css
a.foo {}
```
