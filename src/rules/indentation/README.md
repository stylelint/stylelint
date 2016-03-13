# indentation

Specify indentation.

```css
   |@media print {
   |  a {
   | ↑  background-position: top left,
   | ↑ ↑  top right;
   | ↑}↑ ↑
   |}↑ ↑ ↑
/**  ↑ ↑ ↑
 * The indentation at these three points */
```

## Options

`int|"tab"` - int = number of spaces

### `2`

Always indent at-rules, rules, comments, declarations, and multi-line values by 2 spaces.

The following patterns are considered warnings:

```css
@media print {
a {
background-position: top left,
top right;
}
}
```

```css
@media print {
a {
  background-position: top left,
    top right;
  }
}
```

```css
@media print {
  a {
    background-position: top left,
    top right;
  }
}
```

```css
@media print {
  a,
    b {
    background-position: top left,
      top right;
  }
}
```

```css
a {
/* blergh */
  color: pink;
}
  /* blergh */
```

```css
@media print,
(-webkit-min-device-pixel-ratio: 1.25),
(min-resolution: 120dpi) {}
```

The following patterns are *not* considered warnings:

```css
@media print {
  a {
    background-position: top left,
      top right;
  }
}
```

```css
@media print {
  a,
  b {
    background-position: top left,
      top right;
  }
}
```

```css
a {
  /* blergh */
  color: pink;
}
/* blergh */
```

```css
@media print,
  (-webkit-min-device-pixel-ratio: 1.25),
  (min-resolution: 120dpi) {}
```

## Optional options

### `except: ["block", "value", "param"]`

Do *not* indent for these things.

For example, with `2`:

The following patterns are considered warnings:

```css
@media print,
  (-webkit-min-device-pixel-ratio: 1.25),
  (min-resolution: 120dpi) {
  a {
    background-position: top left,
      top right;
  }
}
```

The following patterns are *not* considered warnings:

```css
@media print,
(-webkit-min-device-pixel-ratio: 1.25),
(min-resolution: 120dpi) {
a {
background-position: top left,
top right;
}
}
```

### `ignore: ["value"]`

Ignore the indentation of values.

For example, with `2`:

The following patterns are *not* considered warnings:

```css
a {
  background-position: top left,
top right,
  bottom left,
    bottom right;
}
```

### `ignore: ["param"]`

Ignore the indentation of at-rule params.

For example, with `2`:

The following patterns are *not* considered warnings:

```css
@media print,
  (-webkit-min-device-pixel-ratio: 1.25),
    (min-resolution: 120dpi) {
}
```

### `hierarchicalSelectors: true|false`

Add additional indentation levels for hierarchical relationships between selectors.

The basic rule is this: If selectors are grouped in such a way that Rule A should be followed by other rules whose selectors *start* with the same characters as Rule A's (complete) selector, then Rule A is superordinate to those rules. This hierarchy can nest indefinitely.

If a `@media` statement only contains rules that are subordinate to the rule *before* the `@media` statement, it is considered subordinate to that rule (see example below).

Such a pattern can apply to combinators or BEM-style naming.

For example, with `2`:

The following patterns are considered warnings:

```css
.foo {}
.foo-sub {}
```

```css
#foo ul {}
#foo ul > li {}
#foo ul > li > a {}
```

```css
.foo {}
  .foo-two {}
  .foo-two-sub {}
.bar {}
```

```css
.foo {}
@media print {
  .foo-one {}
  .foo-two {}
}
```

The following patterns are *not* considered warnings:

```css
.foo {}
  .foo-sub {}
```

```css
#foo ul {}
  #foo ul > li {}
    #foo ul > li > a {}
#bar ul {}
```

```css
.foo {}
  .foo-one {}
  .foo-two {}
    .foo-two-sub {}
  .foo-three {}
.bar {}
```

```css
.foo {}
  @media print {
    .foo-one {}
    .foo-two {}
      .foo-two-sub {}
  }
.bar {}
```

## Caveats

Function arguments are simply ignored, to allow for arbitrary indentation. So any of the following are *not* considered warnings:

```css
.foo {
  color: rgb(0, 0, 0);
}
```

```css
.foo {
  color: rgb(
    0,
    0,
    0
  );
}
```

```css
.foo {
  color: rgb(
      0,
      0,
      0
    );
}
```

```css
.foo {
  color: bar(
    rgb(
    0,
    0,
    0
    )
  );
}
```
