# declaration-block-single-line-max-declarations

Limit the number of declarations within a single line declaration block.

```css
a { color: pink; top: 0; }
/** ↑            ↑
 * The number of these declarations */
```

## 选项

`int`: Maximum number of declarations allowed.

例如，使用 `1`：

以下模式被视为违规：

```css
a { color: pink; top: 3px; }
```

```css
a,
b { color: pink; top: 3px; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
a,
b { color: pink; }
```

```css
a {
  color: pink;
  top: 3px;
}
```
