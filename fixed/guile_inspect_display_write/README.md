# Guile Scheme Repl display write bug in ,inspect

## What is broken?

Write and display commands inside ,i never work correctly 

```
scheme@(guile-user)> ,i 1
1 inspect> w
Invalid arguments to write. Try `help write'.
1 inspect>
```

## What I did 

I found out that the reason is the variable shadowing

```
scheme@(guile-user)> ,i '(1 (((2)) (3)) 4
... 5 "some long string for some\vbody to read"
... (7 (8 (9))))
(1 (((2)) (3)) 4 …) inspect> p
(1 (((2)) (3)) 4 5 "some long string for some\vbody to read" (7 (8(9))))
(1 (((2)) (3)) 4 …) inspect> w
(1 (((2)) (3)) 4 5 "some long string for some\vbody to read" (7 (8(9))))
(1 (((2)) (3)) 4 …) inspect> d
(1 (((2)) (3)) 4 5 some long string for some
                                            body to read (7 (8 (9))))
```

## Status
~~I am waiting it to be merged~~
I have fixed the bug.

codeberg: [https://codeberg.org/guile/guile/pulls/221](https://codeberg.org/guile/guile/pulls/221)
