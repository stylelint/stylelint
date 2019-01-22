# selector-pseudo-element-case

Specify lowercase or uppercase for pseudo-element selectors.

```css
    a::before {}
/**    ↑
 * This is pseudo-element selector */
```

## 选项

`string`: `"lower"|"upper"`

### `"lower"`

以下模式被视为违规：

```css
a:Before {}
```

```css
a:bEfOrE {}
```

```css
a:BEFORE {}
```

```css
a::Before {}
```

```css
a::bEfOrE {}
```

```css
a::BEFORE {}
```

```css
input::-MOZ-PLACEHOLDER {}
```

以下模式*不*被视为违规：

```css
a:before {}
```

```css
a::before {}
```

```css
input::-moz-placeholder {}
```

### `"upper"`

以下模式被视为违规：

```css
a:Before {}
```

```css
a:bEfOrE {}
```

```css
a:BEFORE {}
```

```css
a::Before {}
```

```css
a::bEfOrE {}
```

```css
a::before {}
```

```css
input::-moz-placeholder {}
```

以下模式*不*被视为违规：

```css
a:BEFORE {}
```

```css
a::BEFORE {}
```

```css
input::-MOZ-PLACEHOLDER {}
```
