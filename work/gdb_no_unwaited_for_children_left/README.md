# No unwaited-for children left.

```
2  (binutils-gdb:fix-readline-macros) ivan@way:/build$ gdb ~/Projects/low-level-programming/2.2.1/hello 
GNU gdb (GDB) 17.2
Copyright (C) 2025 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-unknown-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<https://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from /home/ivan/Projects/low-level-programming/2.2.1/hello...
(gdb) b hello.asm:23
Breakpoint 1 at 0x401000: file hello.asm, line 23.
(gdb) b hello.asm:25
Breakpoint 2 at 0x40100a: file hello.asm, line 25.
(gdb) b hello.asm:27
Breakpoint 3 at 0x401019: file hello.asm, line 27.
(gdb) b hello.asm:48
Breakpoint 4 at 0x401025: file hello.asm, line 48.
(gdb) run
Starting program: /home/ivan/Projects/low-level-programming/2.2.1/hello 

Breakpoint 1, _start () at hello.asm:23
23        mov   rax, 1
(gdb) c
Continuing.

Breakpoint 2, _start () at hello.asm:25
25        mov   rsi, message
(gdb) c
Continuing.

Breakpoint 3, _start () at hello.asm:27
27        syscall
(gdb) c
Continuing.
Hello, world!

Breakpoint 4, _start () at hello.asm:48
48        syscall
(gdb) c
Continuing.
[Inferior 1 (process 122019) exited normally]
(gdb) run
Starting program: /home/ivan/Projects/low-level-programming/2.2.1/hello 
No unwaited-for children left.
(gdb) 
```

## Status

not reported, not debugged
