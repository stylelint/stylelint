# function-url-scheme-whitelist

Specify a whitelist of allowed url schemes.

```css
a { background-image: url('http://www.example.com/file.jpg'); }
/**                        ↑
 *           This url scheme */
```

A [url scheme](https://url.spec.whatwg.org/#syntax-url-scheme) consists of alphanumeric, `+`, `-`, and `.` characters. It can appear at the start of a url and is followed by `:`.

This rule treats url schemes as case insensitive (`https` and `HTTPS` are the same).

This rule ignores url arguments without an existing url scheme.

This rule ignores url arguments with variables or variable interpolation (`$sass`, `@less`, `--custom-property`, `#{$var}`, `@{var}`, `$(var)`).

## Options

`array|string`: `["array", "of", "schemes"]|"scheme"`

Given:

```js
["https", "data"]
```

The following patterns are considered warnings:

```css
a { background-image: url('http://www.example.com/file.jpg'); }
```

```css
a { background-image: url('ftp://www.example.com/file.jpg'); }
```

The following patterns are *not* considered warnings:

```css
a { background-image: url('https://www.example.com/file.jpg'); }
```

```css
a { background-image: url('HTTPS://www.example.com/file.jpg'); }
```

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
