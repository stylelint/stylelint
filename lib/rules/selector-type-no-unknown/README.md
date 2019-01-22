# selector-type-no-unknown

Disallow unknown type selectors.

```css
    unknown {}
/** ↑
 * This type selector */
```

This rule considers tags defined in the HTML, SVG, and MathML specifications to be known.

## 选项

### `true`

以下模式被视为违规：

```css
unknown {}
```

```css
tag {}
```

以下模式*不*被视为违规：

```css
input {}
```

```css
ul li {}
```

```css
li > a {}
```

## 可选的辅助选项

### `ignore: ["custom-elements", "default-namespace"]`

#### `"custom-elements"`

Allow custom elements.

以下模式被视为违规：

```css
unknown {}
```

```css
x-Foo {}
```

以下模式*不*被视为违规：

```css
x-foo {}
```

#### `"default-namespace"`

Allow unknown type selectors if they belong to the default namespace.

以下模式被视为违规：

```css
namespace|unknown {}
```

以下模式*不*被视为违规：

```css
unknown {}
```

### `ignoreNamespaces: ["/regex/", /regex/, "string"]`

给定：

```js
["/^my-/", "custom-namespace"]
```

以下模式*不*被视为违规：

```css
custom-namespace|unknown {}
```

```css
my-namespace|unknown {}
```

```css
my-other-namespace|unknown {}
```

### `ignoreTypes: ["/regex/", /regex/, "string"]`

给定：

```js
["/^my-/", "custom-type"]
```

以下模式*不*被视为违规：

```css
custom-type {}
```

```css
my-type {}
```

```css
my-other-type {}
```
