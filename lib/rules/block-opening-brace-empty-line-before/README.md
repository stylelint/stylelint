# block-opening-brace-empty-line-before

Require or disallow an empty line before the opening brace of blocks.

```css

 * This line */
/**  ↓
a /* ↓ */
/* ← */
{
  color: pink;
}
```

## Options

`string`: `"always" | "always-single-line" | "always-multi-line" | "never-single-line" | "never-multi-line" | "never"`

### `always`

There must always be an empty line before the opening brace of a block.

The following patterns are considered violations:

```css
a { color: pink; }
```

```css
a
{ color: pink; }
```

The following patterns are *not* considered violations:

```css
a

{ color: pink; }
```

```css
a

{
  color: pink;
}
```

### `always-single-line`

There must always be an empty line before the opening brace in single-line blocks.

The following patterns are considered violations:

```css
a { color: pink; }
```
The following patterns are *not* considered violations:

```css
a

{ color: pink; }
```

### `always-multi-line`

There must always be an empty line before the opening brace in multi-line blocks.

The following patterns are considered violations:

```css
a {
 color: pink;
}
```

```css
a
{
 color: pink;
}
```

The following patterns are *not* considered violations:

```css
a

{
 color: pink;
}
```

### `never-single-line`

There must never be an empty line before the opening brace in single-line blocks.

The following patterns are considered violations:

```css
a

{ color: pink; }
```

The following patterns are *not* considered violations:

```css
a { color: pink; }
```

```css
a
{ color: pink; }
```

### `never-multi-line`

There must never be an empty line before the opening brace in multi-line blocks.

The following patterns are considered violations:

```css
a

{
  color: pink;
}
```
The following patterns are *not* considered violations:

```css
a
{
  color: pink;
}
```

### `never`

There must never be an empty line before the opening brace of a block.

The following patterns are considered violations:

```css
a

{ color: pink; }
```

```css
a

{
 color: pink;
}
```

The following patterns are *not* considered violations:

```css
a { color: pink; }
```

```css
a
{ color: pink; }
```

```css
a
{
  color: pink;
}
```
