# function-url-no-scheme-relative

Disallow scheme-relative urls.

```css
a { background-image: url('//www.google.com/file.jpg'); }
/**                        ↑ 
 *  This scheme-relative url */
```

A [scheme-relative url](https://url.spec.whatwg.org/#syntax-url-scheme-relative) is a url that begins with `//` followed by a host.

This rule ignores url arguments that are variables (`$sass`, `@less`, `--custom-property`).

## Options

### `true`

The following patterns are considered warnings:

```css
a { 
  background: url("//www.google.com/file.jpg"); 
}
```

The following patterns are *not* considered warnings:

```css
a { 
  background: url("../file.jpg"); 
}
```

```css
a { 
  background: url("http://www.google.com/file.jpg"); 
}
```

```css
a { 
  background: url("/path/to/file.jpg"); 
}
```
