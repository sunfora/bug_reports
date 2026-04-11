### Version
Deno 2.7.11

### Repro Code

Consider `test.js`:
```js
export class Example {
  static at() {
    const ex = new Example();
    ex.deep();
  }
  
  deep() {
    this.#unused();
  }

  broken(x) {
    const x = 1;
  }

  #unused() {
  }
}
```
Run with:

```
deno run -A test.js
```

### Actual Result
```
error: Uncaught SyntaxError: Private field '#unused' must be declared in an enclosing class
    this.#unused();
        ^
    at <anonymous> (file:///home/ivan/Projects/bug_report/test.js:8:9)
```

### Expected Result

There should be a SyntaxError on the redeclaration of `x` inside `broken(x)`, not a misleading error about `#unused`.

```
error: Uncaught SyntaxError: Identifier 'x' has already been declared
    const x = 1;
          ^
    at <anonymous> (file:///home/ivan/Projects/bug_report/test.js:12:11)
```

### Notes
- If you rename #unused to unused, then it works fine.
- This significantly misleads users and hides the real problem.

---

okay, it seems to be an already known issue since Jan 2025:
https://issues.chromium.org/issues/386463462
