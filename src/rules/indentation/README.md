# indentation

Specify indentation.

```css
   |@media print {
   |  a {
   | ↑  background-position: top left,
   | ↑ ↑  top right;
   | ↑}↑ ↑
   |}↑ ↑ ↑
/**  ↑   ↑
 * The indentation at these three points */
```

## Options

`int|"tab"` - int = number of spaces

### `2`

Always indent blocks and values by 2 spaces.

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

The following patterns are *not* considered warnings:

```css
@media print {
  a {
    background-position: top left,
      top right;
  }
}
```

## Optional options

### `except: ["block", "value"]`

Do *not* indent for these things.

For example, with `2`:

The following patterns are considered warnings:

```css
@media print {
  a {
    background-position: top left,
      top right;
  }
}
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
