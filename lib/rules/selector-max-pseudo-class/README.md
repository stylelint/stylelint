# selector-max-pseudo-class

Limit the number of pseudo classes in a selector.

```css
.foo .bar:first-child:hover {}
/*       ↑           ↑
         |           |
         1           2 -- this selector contains two pseudo classes */
```

## Options

`int`: Maximum pseudo classes allowed.

For example, with `1`:

The following patterns are considered violations:

```css
a:first:focus { color: pink; }

```

```css
.foo .bar:first-child:hover { color: pink; }

```

The following patterns are *not* considered violations:

```css
a { color: pink; }
```

```css
a:first-child { color: pink; }
```

```css
.foo .bar:first-child { color: pink; }
```

