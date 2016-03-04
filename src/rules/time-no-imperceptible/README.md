# time-no-imperceptible

Disallow `animation` and `transition` times under 100ms.

```css
.foo { animation: slip-n-slide 150ms linear; }
/**                            ↑
 *                     This time */
```

This rule checks `transition-duration`, `transition-delay`, `animation-duration`, `animation-delay`, and those times as they manifest in the `transition` and `animation` shorthands.

The following patterns are considered warnings:

```css
.foo { animation: 80ms; }
```

```css
.foo { transition-duration: 0.08s; }
```

```css
.foo { transition: background-color 6ms linear; }
```

```css
.foo { animation: horse-dance 1s linear 0.01s; }
```

The following patterns are *not* considered warnings:

```css
.foo { animation: 8s; }
```

```css
.foo { transition-duration: 0.8s; }
```

```css
.foo { transition: background-color 600ms linear; }
```

```css
.foo { animation: horse-dance 1s linear 1.3s; }
```
