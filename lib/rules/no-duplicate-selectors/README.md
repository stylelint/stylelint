# no-duplicate-selectors

禁止样式表中的重复选择器。

```css
    .foo {} .bar {} .foo {}
/** ↑              ↑
 *    这些都是重复的 */
```

此规则检查两种类型的重复：

-   规则的选择器列表中单个选择器的重复，例如 `a，b，a {}`。
-   样式表中重复的选择器列表，例如 `a, b {} a, b {}`。即使选择器具有不同的顺序或具有不同的间隔，重复也会被找到，例如 `a d, b > c {} b>c, a   d {}`。

在以下情况下*允许*相同的选择器重复：

-   它用于不同的选择器列表，例如 `a {} a, b {}`。
-   重复项源自不同的样式表，例如您以某种为 PostCSS 生成 sourcemap 的方式连接或编译文件，如 postcss-import。
-   重复项在具有不同父节点的规则中，例如媒体查询的内部和外部。

此规则解析嵌套选择器。所以 `a b {} a { & b {} }` 计为违规，因为解析后的选择器最终会出现重复。

## 选项

### `true`

以下模式被视为违规：

```css
.foo,
.bar,
.foo {}
```

```css
.foo {}
.bar {}
.foo {}
```

```css
.foo .bar {}
.bar {}
.foo .bar {}
```

```css
@media (min-width: 10px) {
  .foo {}
  .foo {}
}
```

```css
.foo, .bar {}
.bar, .foo {}
```

```css
a .foo, b + .bar {}
b+.bar,
a
  .foo {}
```

```css
a b {}
a {
  & b {}
}
```

以下模式*不*被视为违规：

```css
.foo {}
@media (min-width: 10px) {
  .foo {}
}
```

```css
.foo {
  .foo {}
}
```

```css
.foo {}
.bar {}
.foo .bar {}
.bar .foo {}
```

```css
a b {}
a {
  & b,
  & c {}
}
```
