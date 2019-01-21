# no-empty-source

禁止空源码。

```css
  ···\n\t
/**     ↑
 *  这个空的源码 */
```

仅包含空白的源码被视为空。

## 选项

### `true`

以下模式被视为违规：

```css

```

```css
\t\t
```

```css
\n
```

以下模式*不*被视为违规：

```css
a {}
```

```css
/* Only comments */
```
