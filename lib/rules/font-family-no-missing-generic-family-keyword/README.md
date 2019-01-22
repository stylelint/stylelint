# font-family-no-missing-generic-family-keyword

禁止在字体族名称列表中缺少通用字体族关键字。

```css
a { font-family: Arial, sans-serif; }
/**                     ↑
 *             一个通用族名称示例 */
```
这条规则会检查 `font` 和 `font-family` 属性。

## 选项

### `true`

如下写法被认为是违规的：

```css
a { font-family: Helvetica, Arial, Verdana, Tahoma; }
```

```css
a { font: 1em/1.3 Times; }
```

如下写法*不*被认为是违规的：

```css
a { font-family: Helvetica, Arial, Verdana, Tahoma, sans-serif; }
```

```css
a { font: 1em/1.3 Times, serif; }
```

使用与属性继承或系统字体值相关的关键字也*不*是违规行为。

```css
a { font: inherit; }
b { font: initial; }
i { font: unset; }
input { font: caption; }
```

通用族字体名称可以出现在字体列表的任意位置，这*不*会被认为是违规。换句话说，通用族字体名称不必是字体列表的最后一项。

```css
a { font-family: Helvetica Neue, sans-serif, Apple Color Emoji; }
```
