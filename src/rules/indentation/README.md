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

### `indentInsideParens: ["once", "twice", "once-at-root-twice-in-block"]`

By default, indentation within function arguments and other parentheses are ignored. If you would like to enforce indentation inside parentheses, use this option.

`"once"` means you expect one extra indentation (of your specified type) after newlines inside parentheses, and expect the closing parenthesis to have no extra indentation. For example:

```css
a {
  color: rgb(
    255,
    255,
    255
  );
  top: 0;
}
```

`"twice"` means you expect two extra indentations (of your specified type) after newlines inside parentheses, and expect the closing parenthesis to have one extra indentation. For example:

```css
a {
  color: rgb(
      255,
      255,
      255
    );
  top: 0;
}
```

`"once-at-root-twice-in-block"` means two things: You want the behavior of `"once"`, as documented above, when the parenthetical expression is part of a node that is an immediate descendent of the root — i.e. not inside a block. And you want the behavior of `"twice"`, as documented above, when the parenthetical expression is part of a node that is inside a block. For example, with a SCSS map:

```scss
$foo: (
  bar: 1,
  baz: 2
);

a {
  color: rgb(
      255,
      255,
      255
    );
  top: 0;
}
```

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

### `indentClosingBrace: true|false`

If `true`, the closing brace of a block (rule or at-rule) will be expected at the same indentation level as the block's inner nodes.

For example, with `indentClosingBrace: true`, the following patterns are considered warnings:

```css
a {
  color: pink;
}
```

```css
@media print {
  a {
    color: pink;
  }  
}
```

And the following patterns are *not* considered warnings:

```css
a {
  color: pink;
  }
```

```css
@media print {
  a {
    color: pink;
    }  
  }
```
