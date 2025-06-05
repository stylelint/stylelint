# function-url-no-scheme-relative

Disallow scheme-relative urls.

<!-- prettier-ignore -->
```css
a { background-image: url('//www.example.org/file.jpg'); }
/**                        ↑
 *  This scheme-relative url */
```

A [scheme-relative url](https://url.spec.whatwg.org/#syntax-url-scheme-relative) is a url that begins with `//` followed by a host.

This rule ignores url arguments that are variables (`$sass`, `@less`, `--custom-property`).

## Options

### `true`

```json
{
  "function-url-no-scheme-relative": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  background: url("//www.example.org/file.jpg");
}
```

<!-- prettier-ignore -->
```css
@import url("//www.example.org/foo.css");
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  background: url("../file.jpg");
}
```

<!-- prettier-ignore -->
```css
a {
  background: url("http://www.example.org/file.jpg");
}
```

<!-- prettier-ignore -->
```css
a {
  background: url("/path/to/file.jpg");
}
```

<!-- prettier-ignore -->
```css
@import url("http://www.example.org/foo.css");
```

<!-- prettier-ignore -->
```css
@import url("/path/to/foo.css");
```
