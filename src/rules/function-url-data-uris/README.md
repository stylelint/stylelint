# function-url-data-uris

Require or disallow data URIs for urls.

```css
a { background-image: url('data:image/gif;base64,R0lGODlh='); }
/**                        ↑ 
 *                  This data URI */
```

This rule ignores variables inside `url` function (`$sass`, `@less`, `--custom-property`).

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be data URIs in url.

The following patterns are considered warnings:

```css
a { 
  background-image: url(image.gif) 
} 
```

```css
@font-face { 
  font-family: 'foo'; 
  src: url(foo.ttf); 
}
```

The following patterns are *not* considered warnings:

```css
a {
  background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=')
}
```

```css
@font-face { 
  font-family: 'foo'; 
  src: url(data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=); 
}
```

### `"never"`

There *must never* be data URIs in url.

The following patterns are considered warnings:

```css
a {
  background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=')
}
```

```css
@font-face { 
  font-family: 'foo'; 
  src: url(data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=); 
}
```

The following patterns are *not* considered warnings:

```css
a {
  background-image: url(image.gif) 
}
```

```css
@font-face { 
  font-family: 'foo'; 
  src: url(foo.ttf); 
}
```
