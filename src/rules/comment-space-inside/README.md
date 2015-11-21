# comment-space-inside

Require or disallow whitespace on the inside of comment markers.

```css
    /* comment */
/**  ↑         ↑
 * The space inside these two markers */
```

Any number of asterisks are allowed at the beginning or end of the comment.
So `/** comment **/` is treated the same way as `/* comment */`.

Unlike most other `*-space-*` rules, this one allow *any whitespace*, not just a single space.

If you're using a custom syntax which support single-line comments with `//`, those are ignored.

In a future release, this rule's name will be changed to `comment-whitespace-inside`.

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space inside the markers.

The following patterns are considered warnings:

```css
/*comment*/
```

```css
/*comment */
```

```css
/** comment**/
```

The following patterns are *not* considered warnings:

```css
/* comment */
```

```css
/** comment **/
```

```css
/**
 * comment
 */
```

```css
/*     comment
*/
```

### `"never"`

There *must never* be whitespace on the inside the markers.

The following patterns are considered warnings:

```css
/* comment */
```

```css
/*comment */
```

```css
/** comment**/
```

The following patterns are *not* considered warnings:

```css
/*comment*/
```

```css
/****comment****/
```
