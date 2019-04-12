# max-lines

Limit the number of lines.

```css
.a {} /* ← */
      /* ← */
.b {} /* ← */
      /* ← */
.c {} /* ← */
/**      ↑
 * These lines */
```

## Options

`int`: Maximum number of lines allowed.

For example, with `2`:

The following patterns are considered violations:

```css
.a {
  color: red;
}
```

```css
.a { color: red; }

.b { color: green; }
```

The following patterns are *not* considered violations:

```css
.a { color: red; }
```

```css
.a { color: red; }
.b { color: green; }
```
