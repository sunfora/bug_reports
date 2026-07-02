# Summary

When user interrupts guile REPL ,trace command. 
The ,trace stops working for subsequent REPL command invocations.

# details

@version         3.0.9 / 3.0.11
@config.guess    x86_64-pc-linux-gnu
@package-manager guix

# steps to reproduce

1. fire up a repl with `guile -q`
2. ,trace some long working command
3. interrupt it in the middle of tracing
4. try ,trace it again

# what is expected

,trace would work fine for new call

# what actually happens

,trace stops producing output

# example
```
ivan@way:~$ guile -q
GNU Guile 3.0.11
Copyright (C) 1995-2024 Free Software Foundation, Inc.

Guile comes with ABSOLUTELY NO WARRANTY; for details type `,show w'.
This program is free software, and you are welcome to redistribute it
under certain conditions; type `,show c' for details.

Enter `,help' for help.
scheme@(guile-user)> ,trace (map 1+ (iota 1000000))
trace: |  (_ (guile) #:ensure #f)
trace: |  (_ #<procedure 76cc89728600 at ice-9/boot-9.scm:3295:7 ()>)
trace: |  |  (lock-mutex #<mutex 76cc93afcf80>)
trace: |  |  #t
trace: |  |  (_)
trace: |  |  |  (nested-ref-module #<module () 76cc93a8ad20> (guile))
trace: |  |  |  |  (module-ref-submodule #<module () 76cc93a8ad20> #)
trace: |  |  |  |  |  (_ #<module () 76cc93a8ad20>)
trace: |  |  |  |  |  #<hash-table 76cc93ab4f80 130/223>
trace: |  |  |  |  |  (hashq-ref #<hash-table 76cc93ab4f80 130/223> #)
trace: |  |  |  |  |  #<module (guile) 76cc93a8ae60>
trace: |  |  |  |  #<module (guile) 76cc93a8ae60>
trace: |  |  |  #<module (guile) 76cc93a8ae60>
trace: |  |  |  (_ #<module (guile) 76cc93a8ae60>)
trace: |  |  |  #<interface (guile) 76cc93a8adc0>
trace: |  |  #<module (guile) 76cc93a8ae60>
trace: |  |  (unlock-mutex #<mutex 76cc93afcf80>)
trace: |  |  #t
trace: |  (_ #<procedure values _> (#<module (guile) 76cc93a8ae60>))
trace: |  (_ #<module (guile) 76cc93a8ae60>)
trace: |  #<module (guile) 76cc93a8ae60>
trace: |  (iota 1000000)
trace: |  |  (integer? 1000000)
trace: |  |  #t
trace: |  |  (_)
trace: |  |  |  (%after-gc-thunk)
trace: |  |  |  #<unspecified>
trace: |  |  (_)
trace: |  |  |  (%after-gc-thunk)
trace: |  |  |  #<unspecified>
trace: |  (0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 …)
trace: |  (map #<procedure #{1+}# (_)> (0 1 2 3 4 5 6 7 8 9 10 11 # …))
trace: |  |  (list? (0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 …))
trace: |  |  #t
trace: |  (map1 (0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 …))
trace: |  |  (#{1+}# 0)
trace: |  |  1
trace: |  |  (map1 (1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 …))
trace: |  |  |  (#{1+}# 1)
trace: |  |  |  2
trace: |  |  |  (map1 (2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 # …))
trace: |  |  |  |  (#{1+}# 2)
trace: |  |  |  |  3
trace: |  |  |  |  (map1 (3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 …))
trace: |  |  |  |  |  (#{1+}# 3)
trace: |  |  |  |  |  4
trace: |  |  |  |  |  (map1 (4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 …))
trace: |  |  |  |  |  |  (#{1+}# 4)
trace: |  |  |  |  |  |  5
trace: |  |  |  |  |  |  (map1 (5 6 7 8 9 10 11 12 13 14 15 16 17 # …))
trace: |  |  |  |  |  |  |  (#{1+}# 5)
trace: |  |  |  |  |  |  |  6
trace: |  |  |  |  |  |  |  (map1 (6 7 8 9 10 11 12 13 14 15 16 17 …))
trace: |  |  |  |  |  |  |  |  (#{1+}# 6)
trace: |  |  |  |  |  |  |  |  7
trace: |  |  |  |  |  |  |  |  (map1 (7 8 9 10 11 12 13 14 15 16 17 …))
trace: |  |  |  |  |  |  |  |  |  (#{1+}# 7)
trace: |  |  |  |  |  |  |  |  |  8
trace: |  |  |  |  |  |  |  |  |  (map1 (8 9 10 11 12 13 14 15 16 # …))
trace: |  |  |  |  |  |  |  |  |  |  (#{1+}# 8)
trace: |  |  |  |  |  |  |  |  |  |  9
trace: |  |  |  |  |  |  |  |  |  |  (map1 (9 10 11 12 13 14 15 16 …))
trace: |  |  |  |  |  |  |  |  |  |  11> (#{1+}# 9)
trace: |  |  |  |  |  |  |  |  |  |  11< 10
trace: |  |  |  |  |  |  |  |  |  |  11> (map1 (10 11 12 13 14 15 # …))
trace: |  |  |  |  |  |  |  |  |  |  12> (#{1+}# 10)
trace: |  |  |  |  |  |  |  |  |  |  12< 11
trace: |  |  |  |  |  |  |  |  |  |  12> (map1 (11 12 13 14 15 16 # …))
trace: |  |  |  |  |  |  |  |  |  |  13> (#{1+}# 11)
trace: |  |  |  |  |  |  |  |  |  |  13< 12
trace: |  |  |  |  |  |  |  |  |  |  13> (map1 (12 13 14 15 16 17 # …))
trace: |  |  |  |  |  |  |  |  |  |  14> (#{1+}# 12)
trace: |  |  |  |  |  |  |  |  |  |  14< 13
trace: |  |  |  |  |  |  |  |  |  |  14> (map1 (13 14 15 16 17 18 # …))
trace: |  |  |  |  |  |  |  |  |  |  15> (#{1+}# 13)
trace: |  |  |  |  |  |  |  |  |  |  15< 14
trace: |  |  |  |  |  |  |  |  |  |  15> (map1 (14 15 16 17 18 19 # …))
trace: |  |  |  |  |  |  |  |  |  |  16> (#{1+}# 14)
trace: |  |  |  |  |  |  |  |  |  |  16< 15
trace: |  |  |  |  |  |  |  |  |  |  16> (map1 (15 16 17 18 19 20 # …))
trace: |  |  |  |  |  |  |  |  |  |  17> (#{1+}# 15)
trace: |  |  |  |  |  |  |  |  |  |  17< 16
trace: |  |  |  |  |  |  |  |  |  |  17> (map1 (16 17 18 19 20 21 # …))
trace: |  |  |  |  |  |  |  |  |  |  18> (#{1+}# 16)
trace: |  |  |  |  |  |  |  |  |  |  18< 17
trace: |  |  |  |  |  |  |  |  |  |  18> (map1 (17 18 19 20 21 22 # …))
trace: |  |  |  |  |  |  |  |  |  |  19> (#{1+}# 17)
trace: |  |  |  |  |  |  |  |  |  |  19< 18
trace: |  |  |  |  |  |  |  |  |  |  19> (map1 (18 19 20 21 22 23 # …))
trace: |  |  |  |  |  |  |  |  |  |  20> (#{1+}# 18)
trace: |  |  |  |  |  |  |  |  |  |  20< 19
trace: |  |  |  |  |  |  |  |  |  |  20> (map1 (19 20 21 22 23 24 # …))
trace: |  |  |  |  |  |  |  |  |  |  21> (#{1+}# 19)
trace: |  |  |  |  |  |  |  |  |  |  21< 20
trace: |  |  |  |  |  |  |  |  |  |  21> (map1 (20 21 22 23 24 25 # …))
trace: |  |  |  |  |  |  |  |  |  |  22> (#{1+}# 20)
trace: |  |  |  |  |  |  |  |  |  |  22< 21
trace: |  |  |  |  |  |  |  |  |  |  22> (map1 (21 22 23 24 25 26 # …))
trace: |  |  |  |  |  |  |  |  |  |  23> (#{1+}# 21)
trace: |  |  |  |  |  |  |  |  |  |  23< 22
trace: |  |  |  |  |  |  |  |  |  |  23> (map1 (22 23 24 25 26 27 # …))
trace: |  |  |  |  |  |  |  |  |  |  24> (#{1+}# 22)
trace: |  |  |  |  |  |  |  |  |  |  24< 23
trace: |  |  |  |  |  |  |  |  |  |  24> (map1 (23 24 25 26 27 28 # …))
trace: |  |  |  |  |  |  |  |  |  |  25> (#{1+}# 23)
trace: |  |  |  |  |  |  |  |  |  |  25< 24
trace: |  |  |  |  |  |  |  |  |  |  25> (map1 (24 25 26 27 28 29 # …))
trace: |  |  |  |  |  |  |  |  |  |  26> (#{1+}# 24)
trace: |  |  |  |  |  |  |  |  |  |  26< 25
trace: |  |  |  |  |  |  |  |  |  |  26> (map1 (25 26 27 28 29 30 # …))
trace: |  |  |  |  |  |  |  |  |  |  27> (#{1+}# 25)
trace: |  |  |  |  |  |  |  |  |  |  27< 26
trace: |  |  |  |  |  |  |  |  |  |  27> (map1 (26 27 28 29 30 31 # …))
trace: |  |  |  |  |  |  |  |  |  |  28> (#{1+}# 26)
trace: |  |  |  |  |  |  |  |  |  |  28< 27
trace: |  |  |  |  |  |  |  |  |  |  28> (map1 (27 28 29 30 31 32 # …))
trace: |  |  |  |  |  |  |  |  |  |  29> (#{1+}# 27)
trace: |  |  |  |  |  |  |  |  |  |  29< 28
trace: |  |  |  |  |  |  |  |  |  |  29> (map1 (28 29 30 31 32 33 # …))
trace: |  |  |  |  |  |  |  |  |  |  30> (#{1+}# 28)
trace: |  |  |  |  |  |  |  |  |  |  30< 29
trace: |  |  |  |  |  |  |  |  |  |  30> (map1 (29 30 31 32 33 34 # …))
trace: |  |  |  |  |  |  |  |  |  |  31> (#{1+}# 29)
trace: |  |  |  |  |  |  |  |  |  |  31< 30
trace: |  |  |  |  |  |  |  |  |  |  31> (map1 (30 31 32 33 34 35 # …))
trace: |  |  |  |  |  |  |  |  |  |  32> (#{1+}# 30)
trace: |  |  |  |  |  |  |  |  |  |  32< 31
trace: |  |  |  |  |  |  |  |  |  |  32> (map1 (31 32 33 34 35 36 # …))
trace: |  |  |  |  |  |  |  |  |  |  33> (#{1+}# 31)
trace: |  |  |  |  |  |  |  |  |  |  33< 32
trace: |  |  |  |  |  |  |  |  |  |  33> (map1 (32 33 34 35 36 37 # …))
trace: |  |  |  |  |  |  |  |  |  |  34> (#{1+}# 32)
trace: |  |  |  |  |  |  |  |  |  |  34< 33
trace: |  |  |  |  |  |  |  |  |  |  34> (map1 (33 34 35 36 37 38 # …))
trace: |  |  |  |  |  |  |  |  |  |  35> (#{1+}# 33)
trace: |  |  |  |  |  |  |  |  |  |  35< 34
trace: |  |  |  |  |  |  |  |  |  |  35> (map1 (34 35 36 37 38 39 # …))
trace: |  |  |  |  |  |  |  |  |  |  36> (#{1+}# 34)
trace: |  |  |  |  |  |  |  |  |  |  36< 35
trace: |  |  |  |  |  |  |  |  |  |  36> (map1 (35 36 37 38 39 40 # …))
trace: |  |  |  |  |  |  |  |  |  |  37> (#{1+}# 35)
trace: |  |  |  |  |  |  |  |  |  |  37< 36
trace: |  |  |  |  |  |  |  |  |  |  37> (map1 (36 37 38 39 40 41 # …))
trace: |  |  |  |  |  |  |  |  |  |  38> (#{1+}# 36)
trace: |  |  |  |  |  |  |  |  |  |  38< 37
trace: |  |  |  |  |  |  |  |  |  |  38> (map1 (37 38 39 40 41 42 # …))
trace: |  |  |  |  |  |  |  |  |  |  39> (#{1+}# 37)
trace: |  |  |  |  |  |  |  |  |  |  39< 38
trace: |  |  |  |  |  |  |  |  |  |  39> (map1 (38 39 40 41 42 43 # …))
trace: |  |  |  |  |  |  |  |  |  |  40> (#{1+}# 38)
trace: |  |  |  |  |  |  |  |  |  |  40< 39
trace: |  |  |  |  |  |  |  |  |  |  40> (map1 (39 40 41 42 43 44 # …))
trace: |  |  |  |  |  |  |  |  |  |  41> (#{1+}# 39)
trace: |  |  |  |  |  |  |  |  |  |  41< 40
trace: |  |  |  |  |  |  |  |  |  |  41> (map1 (40 41 42 43 44 45 # …))
trace: |  |  |  |  |  |  |  |  |  |  42> (#{1+}# 40)
trace: |  |  |  |  |  |  |  |  |  |  42< 41
trace: |  |  |  |  |  |  |  |  |  |  42> (map1 (41 42 43 44 45 46 # …))
trace: |  |  |  |  |  |  |  |  |  |  43> (#{1+}# 41)
trace: |  |  |  |  |  |  |  |  |  |  43< 42
trace: |  |  |  |  |  |  |  |  |  |  43> (map1 (42 43 44 45 46 47 # …))
trace: |  |  |  |  |  |  |  |  |  |  44> (#{1+}# 42)
trace: |  |  |  |  |  |  |  |  |  |  44< 43
trace: |  |  |  |  |  |  |  |  |  |  44> (map1 (43 44 45 46 47 48 # …))
trace: |  |  |  |  |  |  |  |  |  |  45> (#{1+}# 43)
trace: |  |  |  |  |  |  |  |  |  |  45< 44
trace: |  |  |  |  |  |  |  |  |  |  45> (map1 (44 45 46 47 48 49 # …))
trace: |  |  |  |  |  |  |  |  |  |  46> (#{1+}# 44)
trace: |  |  |  |  |  |  |  |  |  |  46< 45
trace: |  |  |  |  |  |  |  |  |  |  46> (map1 (45 46 47 48 49 50 # …))
trace: |  |  |  |  |  |  |  |  |  |  47> (#{1+}# 45)
trace: |  |  |  |  |  |  |  |  |  |  47< 46
trace: |  |  |  |  |  |  |  |  |  |  47> (map1 (46 47 48 49 50 51 # …))
trace: |  |  |  |  |  |  |  |  |  |  48> (#{1+}# 46)
trace: |  |  |  |  |  |  |  |  |  |  48< 47
trace: |  |  |  |  |  |  |  |  |  |  48> (map1 (47 48 49 50 51 52 # …))
trace: |  |  |  |  |  |  |  |  |  |  49> (#{1+}# 47)
trace: |  |  |  |  |  |  |  |  |  |  49< 48
trace: |  |  |  |  |  |  |  |  |  |  49> ^CWhile executing meta-command:
User interrupt
scheme@(guile-user)> ,trace (map 1+ (iota 10000))
scheme@(guile-user)> ;; trace no longer is working
scheme@(guile-user)> ,binding 
scheme@(guile-user)> ;; although others do just fine
scheme@(guile-user)> ,import
(guile)
(system base compile)
(ice-9 session)
(ice-9 regex)
(ice-9 threads)
scheme@(guile-user)> ,trace (map 1+ (iota 100000))
scheme@(guile-user)>
```

# reports

None found yet.

I have searched for bugs mentioning `,trace`, `trace` with combination of `interrupt` here.  
Found nothing obviously matching or directly relevant.

- [https://debbugs.gnu.org/db/pa/lguile.html](https://debbugs.gnu.org/db/pa/lguile.html)
- [https://codeberg.org/guile/guile/issues](https://codeberg.org/guile/guile/issues)

submitted via a letter to a bug-guile@gnu.org

- [https://issues.guix.gnu.org/81117](https://issues.guix.gnu.org/81117)
- [https://debbugs.gnu.org/cgi/bugreport.cgi?bug=81117](https://debbugs.gnu.org/cgi/bugreport.cgi?bug=81117)

