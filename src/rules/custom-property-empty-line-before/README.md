# custom-property-empty-line-before

Require or disallow an empty line before custom properties.

```css
a {
  top: 10px;
                          /* ← */
  --custom-prop2: value;  /* ↑ */   
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
  --custom-prop: value;
  --custom-prop2: value;
}
```

The following patterns are *not* considered warnings:

```css
a {
  top: 10px;

  --custom-prop: value;

  --custom-prop2: value;
}
```

### `"never"`

The following patterns are considered warnings:

```css
a {
  top: 10px;

  --custom-prop: value;

  --custom-prop2: value;
}
```

```css
a {

  --custom-prop: value;
  --custom-prop2: value;
}
```

The following patterns are *not* considered warnings:

```css
a {
  top: 10px;
  --custom-prop: value;
  --custom-prop2: value;
}
```

```css
a {
  --custom-prop: value;
  --custom-prop2: value;
}
```

## Optional options

### `except: ["after-comment", "after-custom-property", "first-nested"]`

#### `"after-comment"`

Reverse the primary option for custom properties that come after a comment.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {

  --custom-prop: value;
  /* comment */

  --custom-prop2: value;
}
```

The following patterns are *not* considered warnings:

```css
a {

  --custom-prop: value;
  /* comment */
  --custom-prop2: value;
}

```

#### `"after-custom-property"`

Reverse the primary option for custom properties that come after another custom property.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {

  --custom-prop: value;

  --custom-prop2: value;
}
```

The following patterns are *not* considered warnings:

```css
a {

  --custom-prop: value;
  --custom-prop2: value;
}
```

#### `"first-nested"`

Reverse the primary option for custom properties that are nested and the first child of their parent node.

For example, with `"always"`:

The following patterns are considered warnings:

```css
a {

  --custom-prop: value;

  --custom-prop2: value;
}
```

The following patterns are *not* considered warnings:

```css
a {
  --custom-prop: value;

  --custom-prop2: value;
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
  --custom-prop: value;
}
```

#### `"inside-single-line-block"`

Ignore custom properties that are inside single-line blocks.

For example, with `"always"`:

The following patterns are *not* considered warnings:

```css
a { --custom-prop: value; --custom-prop2: value; }
```
