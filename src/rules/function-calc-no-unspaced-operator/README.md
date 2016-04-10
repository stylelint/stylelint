# function-calc-no-unspaced-operator

Disallow an unspaced operator within `calc` functions.

```css
a { top: calc(1px + 2px); }
/**               ↑
 * The space around this operator */
```

Before the operator, there must be a single whitespace or a newline plus indentation. After the operator, there must be a single whitespace or a newline.

The following patterns are considered warnings:

```css
a { top: calc(1px+2px); }
```

```css
a { top: calc(1px+ 2px); }
```

The following patterns are *not* considered warnings:

```css
a { top: calc(1px + 2px); }
```

```css
a { top: calc(calc(1em * 2) / 3); }
```

```css
margin-top: calc(var(--some-variable) +
  var(--some-other-variable));
```

```css
margin-top: calc(var(--some-variable)
  + var(--some-other-variable));
```
