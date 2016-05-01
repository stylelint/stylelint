# selector-max-empty-lines

Limit the number of adjacent empty lines within selectors.

```css
.foo,
              /* ← */
.bar {        /* ↑ */
  color: red; /* ↑ */
}             /* ↑ */
/**              ↑
 *        This empty line */
```

## Options

`int`: Maximum number of empty lines.

For example, with `0`:

The following patterns are considered warnings:

```css
.foo

.bar {
  color: red;
}
```

```css
.foo,

.bar {
  color: red;
}
```

```css
.foo

>
.bar {
  color: red;
}
```

```css
.foo
>

.bar {
  color: red;
}
```

The following patterns are *not* considered warnings:

```css
.foo .bar {
  color: red;
}
```

```css
.foo
.bar {
  color: red;
}
```

```css
.foo,
.bar {
  color: red;
}
```

```css
.foo > .bar {
  color: red;
}
```

```css
.foo 
> 
.bar {
  color: red;
}
```
