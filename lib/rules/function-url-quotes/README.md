# function-url-quotes

Require or disallow quotes for urls.

```css
a { background: url("x.jpg") }
/**                 ↑     ↑
 *             These quotes */
```

## 选项

`string`: `"always"|"never"`

### `"always"`

Urls *must always* be quoted.

以下模式被视为违规：

```css
@import url(foo.css);
```

```css
@document domain(http://www.w3.org/);
```

```css
@font-face { font-family: 'foo'; src: url(foo.ttf); }
```

```css
@-moz-document url-prefix() {}
```

以下模式*不*被视为违规：

```css
a { background: url('x.jpg'); }
```

```css
@import url("foo.css");
```

```css
@document domain('http://www.w3.org/');
```

```css
@font-face { font-family: "foo"; src: url("foo.ttf"); }
```

```css
@-moz-document url-prefix('') {}
```

### `"never"`

Urls *must never* be quoted.

以下模式被视为违规：

```css
a { background: url('x.jpg'); }
```

```css
@import url("foo.css");
```

```css
@font-face { font-family: "foo"; src: url('foo.ttf'); }
```

以下模式*不*被视为违规：

```css
a { background: url(x.jpg); }
```

```css
@import url(foo.css);
```

```css
@font-face { font-family: 'foo'; src: url(foo.ttf); }
```

## 可选的辅助选项

### `except: ["empty"]`

Reverse the primary option if the function has no arguments.

For example, with `"always"`.

以下模式*不*被视为违规：

```css
@-moz-document url-prefix() {}
```
