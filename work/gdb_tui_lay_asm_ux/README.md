# GDB: \[ux\] Uninuitive scrolling in disassembly window

Consider some very small x86-64 program for gnu/linux.

```
global _start

section .data
message: db 'Hello, world!', 10

section .text
_start:
  mov   rax, 1
  mov   rdi, 1
  mov   rsi, message
  mov   rdx, 14
  syscall

  mov rax, 60
  mov rdi, 0
  syscall
```

( 
  compiled and linked with: 
   ```
   yasm -O0 -g dwarf2 -f elf64 "$asm_source" -o "$object_file";
   ld "$object_file" -o "$elf_binary"; 
   ```
  and ran with:
   ```
   gdb --quiet                          \
     -ex "set debuginfod enabled off"   \
     -ex "set disassembly-flavor intel" \
     -ex "break _start"                 \
     -ex "layout asm"                   \
     -ex "layout regs"                  \
     -ex "run"                          \
     --args                             \
     "$elf_binary" "$@"
   ```
 )

The user sees the contents of a .text section in asm window,
followed by some zeroed out memory as expected.

```
0x401000 <_start>    mov rax,0x1
0x401007 <_start+7>  mov rdi,0x1
     ...
0x40102c <_start+44> syscall
0x40102e             add BYTE PTR [rax],al
0x401030             add BYTE PTR [rax],al             
     ...
```

If you scroll one line down, gdb allows you to scroll one line up. 
But if you try to scroll past the `0x40102c <_start+44> syscall` for example, a page down. gdb would forget how to scroll a page up.

Which, for me, is an unintuitive behavior of a debugger even considering
all the problems with upwards disassembling.

Ideally what the user would expect?

Well I guess it is fine to expect that the program would remember that the last explicit `disas <addr>` or breakpoint, or any other action which altered currently viewed pc in a window would be remembered.

And that address would act like an anchor: anything below that point should be scrollable without restrictions: if the user goes `a page` lines down, the user should get back with `a page` lines up counter motion.


# Status 
reported

[https://sourceware.org/bugzilla/show_bug.cgi?id=34399](https://sourceware.org/bugzilla/show_bug.cgi?id=34399)
