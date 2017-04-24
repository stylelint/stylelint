# rule-non-nested-empty-line-before

***Deprecated: instead use the [rule-empty-line-before](../rule-empty-line-before/README.md).***

Require or disallow an empty line before non-nested rules.

```css
a {}
      /* ← */
b {}  /* ↑ */
/**      ↑
 * This line */
```

If the rule is the very first node in a stylesheet then it is ignored.

## Options

`string`: `"always"|"never"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be an empty line before rules.

The following patterns are considered violations:

```css
a {} b {}
```

```css
a {}
b {}
```

The following patterns are *not* considered violations:

```css
a {}

b {}
```

### `"never"`

There *must never* be an empty line before rules.

The following patterns are considered violations:

```css
a {}

b {}
```

The following patterns are *not* considered violations:

```css
a {} b {}
```

```css
a {}
b {}
```

### `"always-multi-line"`

There *must always* be an empty line before multi-line rules.

The following patterns are considered violations:

```css
a
{}
b
{}
```

The following patterns are *not* considered violations:

```css
a
{}

b
{}
```

### `"never-multi-line"`

There *must never* be an empty line before multi-line rules.

The following patterns are considered violations:

```css
a
{}

b
{}
```

The following patterns are *not* considered violations:

```css
a
{}
b
{}
```

## Optional secondary options

### `ignore: ["after-comment"]`

Ignore rules that come after a comment.

The following patterns are *not* considered violations:

```css
a
{}
/* comment */
b
{}
```

```css
a
{}
/* comment */

b
{}
```

## Optional secondary options

### `except: ["after-single-line-comment"]`

For example, with `"always"`:

The following patterns are considered violations:

```css
/* comment */

a
{}
```

The following patterns are *not* considered violations:

```css
/* comment */
a
{}
```
