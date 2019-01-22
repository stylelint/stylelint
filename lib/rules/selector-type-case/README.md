# selector-type-case

Specify lowercase or uppercase for type selectors.

```css
    a {}
/** ↑
 * This is type selector */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"lower"|"upper"`

### `"lower"`

以下模式被视为违规：

```css
A {}
```

```css
LI {}
```

以下模式*不*被视为违规：

```css
a {}
```

```css
li {}
```

### `"upper"`

以下模式被视为违规：

```css
a {}
```

```css
li {}
```

以下模式*不*被视为违规：

```css
A {}
```

```css
LI {}
```

## 可选的辅助选项

### `ignoreTypes: ["/regex/", "non-regex"]`

给定：

```js
["$childClass", "/(p|P)arent.*/"]
```

以下模式*不*被视为违规：

```css
myParentClass {
  color: pink;
}

$childClass {
  color: pink;
}
```
