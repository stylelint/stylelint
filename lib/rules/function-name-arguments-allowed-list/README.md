# function-name-arguments-allowed-list

Specify a whitelist of allowed property and value pairs within declarations.

<!-- prettier-ignore -->
```css
a { background: url('http://www.example.com/file.jpg'); }
/** ↑               ↑
 * These properties and these values */
```

## Options

`object`: `{"unprefixed-function-name": ["/regex/", /regex/] }`

Given:

```
["/^images/", "/^http/"]
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a { background-image: url(data/x.jpg); }
```

<!-- prettier-ignore -->
```css
a { background: url(#fff) }
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
a { background-image: url('vendor/file.jpg'); }
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
a { background: url(images/x.jpg); }
```

<!-- prettier-ignore -->
```css
a { background-image: url(vendor/x.jpg); }
```

<!-- prettier-ignore -->
```css
a { background: url(https://image/1.png); }
```

<!-- prettier-ignore -->
```css
a { background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=); }
```

<!-- prettier-ignore -->
```css
a { background-image: #fff url(images/select2.png) no-repeat 100% -22px }
```

<!-- prettier-ignore -->
```css
a {background-image: url(images/select2.png) no-repeat 100% -22px, -moz-linear-gradient(bottom, #fff 85%, #eee 99%);}
```
