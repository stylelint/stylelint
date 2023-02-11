# function-url-scheme-allowed-list

Specify a list of allowed URL schemes.

<!-- prettier-ignore -->
```css
a { background-image: url('http://www.example.com/file.jpg'); }
/**                        ↑
 *           This URL scheme */
```

A [URL scheme](https://url.spec.whatwg.org/#syntax-url-scheme) consists of alphanumeric, `+`, `-`, and `.` characters. It can appear at the start of a URL and is followed by `:`.

This rule ignores:

- URL arguments without an existing URL scheme
- URL arguments with variables or variable interpolation (`$sass`, `@less`, `--custom-property`, `#{$var}`, `@{var}`, `$(var)`)

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`array|string|regex`: `["array", "of", /schemes/, "/regex/"]|"scheme"|"/regex/"|/regex/`

Given:

```json
["data", "/^http/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { background-image: url('file://file.jpg'); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { background-image: url('example.com/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('/example.com/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('//example.com/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('./path/to/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('http://www.example.com/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('https://www.example.com/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('HTTPS://www.example.com/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }
```
