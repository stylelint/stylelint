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
a:first:focus {}

```

```css
.foo .bar:first-child:hover {}

```

The following patterns are *not* considered violations:

```css
a {}
```

```css
a:first-child {}
```

```css
.foo .bar:first-child {}
```

