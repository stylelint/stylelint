# function-url-no-scheme-relative

Disallow scheme-relative urls.

<!-- prettier-ignore -->
```css
a { background-image: url('//www.example.org/file.jpg'); }
/**                        ↑
 *  This scheme-relative url */
```

You can use this rule to enforce a convention, as a [scheme-relative URL](https://url.spec.whatwg.org/#syntax-url-scheme-relative) takes its scheme from the page and so fails when the page is opened from disk.

This rule ignores url arguments that are variables (`$sass`, `@less`, `--custom-property`).

This rule doesn't have any [message arguments](../../../docs/user-guide/configure.md#message).

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
