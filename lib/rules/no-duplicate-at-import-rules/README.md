# no-duplicate-at-import-rules

禁止在样式表中使用重复的 `@import` 规则。

```css
    @import "a.css";
    @import "a.css";
/** ↑
 * 这些都是重复的 */
```

## 选项

### `true`

以下模式被视为违规：

```css
@import 'a.css';
@import 'a.css';
```

```css
@import url("a.css");
@import url("a.css");
```

```css
@import "a.css";
@import 'a.css';
```

```css
@import "a.css";
@import 'b.css';
@import url(a.css);
```

以下模式*不*被视为违规：

```css
@import "a.css";
@import "b.css";
```

```css
@import url('a.css') projection;
@import url('a.css') tv;
```
