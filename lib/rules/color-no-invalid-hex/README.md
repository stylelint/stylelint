# color-no-invalid-hex

禁止使用无效的十六进制颜色。

```css
a { color: #y3 }
/**        ↑
 * 这些十六进制颜色 */
```

正常的十六进制颜色可以是 6 位或者 8 位（包含透明度）十六进制值， 而他们对应的简写形式则可以是 3 位或者 4 位十六进制值。

## 选项

### `true`

以下的模式被视为违规。

```css
a { color: #00; }
```

```css
a { color: #fff1az; }
```

```css
a { color: #12345aa; }
```

以下模式*不*被视为违规。

```css
a { color: #000; }
```

```css
a { color: #000f; }
```

```css
a { color: #fff1a0; }
```

```css
a { color: #123450aa; }
```
