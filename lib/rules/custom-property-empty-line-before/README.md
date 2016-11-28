# custom-property-empty-line-before

Require or disallow an empty line before custom properties.

```css
a {
  top: 10px;
                          /* ← */
  --foo: pink;            /* ↑ */
}                         /* ↑ */
/**                          ↑
 *                   This line */
```

## Options

`string`: `"always"|"never"`

### `"always"`

The following patterns are considered warnings:

```css
a {
  top: 10px;
  --foo: pink;
  --bar: red;
}
```

The following patterns are *not* considered warnings:

```css
a {
  top: 10px;

  --foo: pink;

  --bar: red;
}
```

### `"never"`

The following patterns are considered warnings:

```css
a {
  top: 10px;

  --foo: pink;

  --bar: red;
}
```

```css
a {

  --foo: pink;
  --bar: red;
}
```

The following patterns are *not* considered warnings:

```css
a {
  top: 10px;
  --foo: pink;
  --bar: red;
}
```

```css
a {
  --foo: pink;
  --bar: red;
}
```

## Optional secondary options

### `except: ["after-comment", "after-custom-property", "first-nested"]`

#### `"after-comment"`

Reverse the primary option for custom properties that come after a comment.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {

  --foo: pink;
  /* comment */

  --bar: red;
}
```

The following patterns are *not* considered warnings:

```css
a {

  --foo: pink;
  /* comment */
  --bar: red;
}

```

#### `"after-custom-property"`

Reverse the primary option for custom properties that come after another custom property.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {

  --foo: pink;

  --bar: red;
}
```

The following patterns are *not* considered warnings:

```css
a {

  --foo: pink;
  --bar: red;
}
```

#### `"first-nested"`

Reverse the primary option for custom properties that are nested and the first child of their parent node.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {

  --foo: pink;

  --bar: red;
}
```

The following patterns are *not* considered warnings:

```css
a {
  --foo: pink;

  --bar: red;
}
```

### `ignore: ["after-comment", "inside-single-line-block"]`

#### `"after-comment"`

Ignore custom properties that are preceded by comments.

For example, with `"always"`:

The following patterns are *not* considered warnings:

```css
a {
  /* comment */
  --foo: pink;
}
```

#### `"inside-single-line-block"`

Ignore custom properties that are inside single-line blocks.

For example, with `"always"`:

The following patterns are *not* considered warnings:

```css
a { --foo: pink; --bar: red; }
```
