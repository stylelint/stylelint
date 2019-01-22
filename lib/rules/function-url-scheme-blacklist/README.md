# function-url-scheme-blacklist

Specify a blacklist of disallowed URL schemes.

```css
a { background-image: url('http://www.example.com/file.jpg'); }
/**                        ↑
 *           This URL scheme */
```

A [URL scheme](https://url.spec.whatwg.org/#syntax-url-scheme) consists of alphanumeric, `+`, `-`, and `.` characters. It can appear at the start of a URL and is followed by `:`.

This rule ignores:

-   URL arguments without an existing URL scheme
-   URL arguments with variables or variable interpolation (`$sass`, `@less`, `--custom-property`, `#{$var}`, `@{var}`, `$(var)`)

## 选项

`array|string|regex`: `["array", "of", /schemes/ or "/regex/"]|"scheme"|/regex/`

给定：

```js
["ftp", "/^http/"]
```

以下模式被视为违规：

```css
a { background-image: url('ftp://www.example.com/file.jpg'); }
```

```css
a { background-image: url('http://www.example.com/file.jpg'); }
```

```css
a { background-image: url('https://www.example.com/file.jpg'); }
```

以下模式*不*被视为违规：

```css
a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }
```

```css
a { background-image: url('example.com/file.jpg'); }
```

```css
a { background-image: url('/example.com/file.jpg'); }
```

```css
a { background-image: url('//example.com/file.jpg'); }
```

```css
a { background-image: url('./path/to/file.jpg'); }
```
