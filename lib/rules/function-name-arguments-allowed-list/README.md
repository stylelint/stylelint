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
a { background-image: url('images/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('http://www.example.com/file.jpg'); }
```

<!-- prettier-ignore -->
```css
a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }
```

The following patterns are _not_ considered violations:

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
a { background-image: url('vendor/file.jpg'); }
```
