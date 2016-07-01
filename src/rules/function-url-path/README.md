# function-url-path

Specify relative or absolute path for urls.

```css
a { background-image: url('./file.jpg'); }
/**                        ↑ 
 *                  This url */
```

This rule ignores variables inside `url` function (`$sass`, `@less`, `--custom-property`).

## Options

`string`: `"absolute"|"relative"`

### `"absolute"`

There *must always* be absolute url.

The following patterns are considered warnings:

```css
a { 
  background: url(./file.jpg);
}
```

```css
a { 
  background: url(../file.jpg);
}
```

The following patterns are *not* considered warnings:

```css
a {
  background: url('/path/to/file.jpg');
}
```

```css
a {
  background: url('//www.google.com/file.jpg'); 
}
```

```css
a {
  background: url('http://www.google.com/file.jpg');
}
```

### `"relative"`

There *must never* be relative url.

The following patterns are considered warnings:

```css
a {
  background: url('/path/to/file.jpg');
}
```

```css
a {
  background: url('//www.google.com/file.jpg');
}
```

```css
a {
  background: url('http://www.google.com/file.jpg');
}
```

The following patterns are *not* considered warnings:

```css
a {
  background: url(./file.jpg);
}
```

```css
a {
  background: url(../file.jpg);
}
```
