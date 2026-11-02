# function-url-scheme-allowed-list

Specify a list of allowed URL schemes.

<!-- prettier-ignore -->
```css
a { background-image: url('http://www.example.com/file.jpg'); }
/**                        ↑
 *           This URL scheme */
```

Use this rule to enforce a subset of URL schemes as a convention. For example, allow only `https` and `data`, as browsers [block `http` assets in `url()` on secure pages](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content#blockable_content).

A [URL scheme](https://url.spec.whatwg.org/#syntax-url-scheme) consists of alphanumeric, `+`, `-`, and `.` characters. It can appear at the start of a URL and is followed by `:`.

This rule ignores:

- URL arguments without an existing URL scheme
- URL arguments with variables or variable interpolation (`$sass`, `@less`, `--custom-property`, `#{$var}`, `@{var}`, `$(var)`)

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the disallowed URL scheme.

## Options

### `Array<string>`

```json
["array", "of", "schemes", "/regex/"]
```

Given:

```json
{
  "function-url-scheme-allowed-list": ["data", "/^http/"]
}
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
