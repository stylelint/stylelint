# function-url-quotes

Specify single, double or no quotes for urls.

```css
a { background: url("x.jpg") }
/**                 ↑     ↑
 *             These quotes */
```

## Options

`string`: `"single"|"double"|"none"`

### `"single"`

Url quotes *must always* be single.

The following patterns are considered warnings:

```css
a { background: url("x.jpg"); }
```

```css
@import url(foo.css);
```

```css
@document domain("http://www.w3.org/");
```

```css
@font-face { font-family: 'foo'; src: url("foo.ttf"); }
```

The following patterns are *not* considered warnings:

```css
a { background: url('x.jpg'); }
```

```css
@import url('foo.css');
```

```css
@document domain('http://www.w3.org/');
```

```css
@font-face { font-family: "foo"; src: url('foo.ttf'); }
```

### `"double"`

Url quotes *must always* be double.

The following patterns are considered warnings:

```css
a { background: url('x.jpg'); }
```

```css
@import url(foo.css);
```

```css
@font-face { font-family: "foo"; src: url('foo.ttf'); }
```

The following patterns are *not* considered warnings:

```css
a { background: url("x.jpg"); }
```

```css
@import url("foo.css");
```

```css
@font-face { font-family: 'foo'; src: url("foo.ttf"); }
```

### `"none"`

Urls *must not* be quoted.

The following patterns are considered warnings:

```css
a { background: url('x.jpg'); }
```

```css
@import url("foo.css");
```

```css
@font-face { font-family: "foo"; src: url('foo.ttf'); }
```

The following patterns are *not* considered warnings:

```css
a { background: url(x.jpg); }
```

```css
@import url(foo.css);
```

```css
@font-face { font-family: 'foo'; src: url(foo.ttf); }
```
