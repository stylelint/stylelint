# selector-max-empty-lines

Limit the number of adjacent empty lines within selectors.

```css
a,
              /* ← */
b {        /* ↑ */
  color: red; /* ↑ */
}             /* ↑ */
/**              ↑
 *        This empty line */
```

## 选项

`int`: Maximum number of empty lines.

例如，使用 `0`：

以下模式被视为违规：

```css
a

b {
  color: red;
}
```

```css
a,

b {
  color: red;
}
```

```css
a

>
b {
  color: red;
}
```

```css
a
>

b {
  color: red;
}
```

以下模式*不*被视为违规：

```css
a b {
  color: red;
}
```

```css
a
b {
  color: red;
}
```

```css
a,
b {
  color: red;
}
```

```css
a > b {
  color: red;
}
```

```css
a
>
b {
  color: red;
}
```
