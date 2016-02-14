# number-max-precision

Limit the number of decimal places allowed in numbers.

```css
.foo { top: 3.245634px; }
/**           ↑
 * These decimal places */
```

## Options

`int`: Maximum number of decimal places allowed.

For example, with `2`:

The following patterns are considered warnings:

```css
.foo { top: 3.245px; }
```

```css
.foo { top: 3.245634px; }
```

```css
@media (min-width: 3.234em) { ... }
```

The following patterns are *not* considered warnings:

```css
.foo { top: 3.24px; }
```

```css
@media (min-width: 3.23em) { ... }
```
