# GDB doesn't work correctly with readline macros 

steps to reproduce:

consider macro in ~/.inputrc 
(otherwise you can make kbd recorded equiv)

```
"\C-x\C-w": "n\rn\r"
```

start gdb with any program
hit any breakpoint
execute macro: \C-x\C-w

gdb would not update the prompt
and if you press any button
it would be stopped by SIGTTIN

---

right now to my understanding the anatomy is the following:
readline emits a line in a rl_callback_read_char, 
gdb_readline_wrapper_line removes a handler

but readline is still in RL_STATE_MACROINPUT
so it discards the macro content


```
	  if (in_handler == 0 && rl_linefunc)
	    _rl_callback_newline ();
	}
    }
  while (rl_pending_input || _rl_pushed_input_available () || RL_ISSTATE (RL_STATE_MACROINPUT));

  CALLBACK_READ_RETURN ();
```

it calls rl_read_key, rl_read_key automatically pops macro
and then if macro is empty as well, attempts to read a char
from input stream via rl_getc

which leads to SIGTTIN

## Status

reported, fix proposed

https://sourceware.org/bugzilla/show_bug.cgi?id=34409
https://github.com/sunfora/gdb/compare/master...clean.fix-readline-macros
