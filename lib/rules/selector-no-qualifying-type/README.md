# selector-no-qualifying-type

Disallow qualifying a selector by type.

```css
    a.foo {}
/** ↑
 * This type selector is qualifying the class */
```

A type selector is "qualifying" when it is compounded with (chained to) another selector (e.g. a.foo, a#foo). This rule does not regulate type selectors that are combined with other selectors via a combinator (e.g. a > .foo, a #foo).

## 选项

### `true`

以下模式被视为违规：

```css
a.foo {
  margin: 0
}
```

```css
a#foo {
  margin: 0
}
```

```css
input[type='button'] {
  margin: 0
}
```

以下模式*不*被视为违规：

```css
.foo {
  margin: 0
}
```

```css
#foo {
  margin: 0
}
```

```css
input {
  margin: 0
}
```

## 可选的辅助选项

### `ignore: ["attribute", "class", "id"]`

#### `"attribute"`

Allow attribute selectors qualified by type.

以下模式*不*被视为违规：

```css
input[type='button'] {
  margin: 0
}
```

#### `"class"`

Allow class selectors qualified by type.

以下模式*不*被视为违规：

```css
a.foo {
  margin: 0
}
```

#### `"id"`

Allow ID selectors qualified by type.

以下模式*不*被视为违规：

```css
a#foo {
  margin: 0
}
```
