# function-name-arguments-whitelist

Specify a whitelist of allowed property and value pairs within declarations.

<!-- prettier-ignore -->
```css
a { background-image: url('http://www.example.com/file.jpg'); }
/** ↑               ↑
 * These properties and these values */
```

## Options

`object`: `{"unprefixed-function-name": ["string", "/regex/", /regex/] }`

Given:

```
["data", "/^http/"]
```

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a { background-image: url('file://file.jpg'); }
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
