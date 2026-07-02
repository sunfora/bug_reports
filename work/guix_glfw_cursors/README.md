# Guix broken cursor on foreign distro

I had a weird bug for a year: my linux mint cinnamon once logged in showed wrong (default) x11 cursor. For quite some time I though the problem had something to do with linux mint. But I had not time to debug the actual reason.

Recently I finally found what was happening and it was... surprising. The reason of my cursor failure was guix on foreign distro installation.

## What happened?

Currently when you install guix system on linux mint then the library named glfw.
You get this thing in your manifest generated:

```scheme
 ("glfw"
  "3.4"
  "out"
  "/gnu/store/jdiv4qbf1mk7f1cs1083hprv0rz5f0zr-glfw-3.4"
  (propagated-inputs
    (...
     ("libxcursor"
      "1.2.3"
      "out"
      "/gnu/store/kv9zpypjbfvba3lv56v775lbz4ri400i-libxcursor-1.2.3"
      (propagated-inputs
        (...))
      (search-paths
        (("XCURSOR_PATH" ("share/icons") ":" directory #f))))
      ...))
  (search-paths
    ((...)
     ("XCURSOR_PATH" ("share/icons") ":" directory #f)))
  ...)
```

This later leads to this shell script line in generated GUIX_PROFILE

```sh
export XCURSOR_PATH="${GUIX_PROFILE:-/gnu/store/m951cfr6zn2r8ksis7j4mz0yir4gbqxr-profile}/share/icons${XCURSOR_PATH:+:}$XCURSOR_PATH"
```

Which... extends the XCURSOR_PATH or sets it if it was empty.  

## So why does it mess with the system's cursor?

Well the thing which is responsible for setting cursor in X11 is libxcursor.
Let's read the source on [freedesktop gitlab](https://gitlab.freedesktop.org/xorg/lib/libxcursor/-/blob/master/src/library.c?ref_type=heads):

```c
/*
 * Copyright © 2024 Thomas E. Dickey
 * Copyright © 2002 Keith Packard
 *
 * SPDX-License-Identifier: HPND-sell-variant
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Keith Packard not be used in
 * advertising or publicity pertaining to distribution of the software without
 * specific, written prior permission.  Keith Packard makes no
 * representations about the suitability of this software for any purpose.  It
 * is provided "as is" without express or implied warranty.
 *
 * KEITH PACKARD DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE,
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS, IN NO
 * EVENT SHALL KEITH PACKARD BE LIABLE FOR ANY SPECIAL, INDIRECT OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
 * DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

#include "xcursorint.h"
#include <stdlib.h>
#include <string.h>

#ifndef ICONDIR
#define ICONDIR "/usr/X11R6/lib/X11/icons"
#endif

#ifndef XCURSORPATH
#define XCURSORPATH "~/.local/share/icons:~/.icons:/usr/share/icons:/usr/share/pixmaps:"ICONDIR
#endif

typedef struct XcursorInherit {
    char	*line;
    const char	*theme;
} XcursorInherit;

const char *
XcursorLibraryPath (void)
{
    static const char	*path;

    if (!path)
    {
	path = getenv ("XCURSOR_PATH");
	if (!path)
	    path = XCURSORPATH;
	traceOpts((T_OPTION(XCURSOR_PATH) ": %s\n", NonNull(path)));
    }
    return path;
}
```

As you can see the logic libcursor has is the following: if `XCURSOR_PATH` is set — use this path.
Otherwise fallback to the default.

1. Linux Mint never sets environment variable `XCURSOR_PATH`.
2. `$GUIX_PROFILE` thus writes its location directly to the `XCURSOR_PATH` environment.
3. libxcursor aparently tries to parse from there 
   (I should actually check if it is really true and it is the libxcursor)
4. finds nothing since there is nothing there
5. fallbacks to default x11 cursor

## package definitions

glfw
```scheme
(define-public glfw
  (package
    (name "glfw")
    (version "3.3.10")
    (source (origin
              (method url-fetch)
              (uri (string-append "https://github.com/glfw/glfw"
                                  "/releases/download/" version
                                  "/glfw-" version ".zip"))
              (sha256
               (base32
                "1f5xs4cj1y5wk1jimv1mylk6n6vh7433js28mfd1kf7p2zw3whz8"))))
    (build-system cmake-build-system)
    (arguments
     (list
      #:modules '((guix build cmake-build-system)
                  (guix build utils)
                  (ice-9 format))
      #:tests? #f                       ;no test target
      #:configure-flags #~(list "-DBUILD_SHARED_LIBS=ON")
      #:phases
      #~(modify-phases %standard-phases
          (add-after 'unpack 'patch-sonames
            (lambda* (#:key inputs #:allow-other-keys)
              (let-syntax ((patch-sonames
                            (syntax-rules ()
                              ((_ (file ...) soname ...)
                               (substitute* (list file ...)
                                 (((format #f "(~@{~a~^|~})" soname ...) lib)
                                  (search-input-file
                                   inputs (string-append
                                           "lib/" lib))))))))
                ;; Avoid looking in LD_LIBRARY_PATH for dlopen calls.
                (patch-sonames ("src/egl_context.c"
                                "src/glx_context.c"
                                "src/vulkan.c"
                                "src/wl_init.c"
                                "src/x11_init.c")
                               "libEGL.so.1"
                               "libGL.so"
                               "libGL.so.1"
                               "libGLESv1_CM.so.1"
                               "libGLESv2.so.2"
                               "libvulkan.so.1"
                               "libwayland-cursor.so.0"
                               "libwayland-egl.so.1"
                               "libwayland-client.so.0"
                               "libxkbcommon.so.0"
                               "libXxf86vm.so.1"
                               "libXi.so.6"
                               "libXrandr.so.2"
                               "libXcursor.so.1"
                               "libXinerama.so.1"
                               "libX11-xcb.so.1"
                               "libXrender.so.1")))))))
    (native-inputs (list doxygen unzip))
    (inputs (list libxkbcommon wayland vulkan-loader))
    (propagated-inputs
     (list mesa              ;included in public headers
           ;; These are in 'Requires.private' of 'glfw3.pc'.
           libx11
           libxrandr
           libxi
           libxinerama
           libxcursor
           libxxf86vm))
    (home-page "https://www.glfw.org")
    (synopsis "OpenGL application development library")
    (description
     "GLFW is a library for OpenGL, OpenGL ES and Vulkan development for
desktop computers.  It provides a simple API for creating windows, contexts
and surfaces, receiving input and events.")
    (license license:zlib)))

```

libxcursor
```scheme
(define-public libxcursor
  (package
    (name "libxcursor")
    (version "1.2.3")
    (source
     (origin
       (method url-fetch)
       (uri (string-append "mirror://xorg/individual/lib/libXcursor-"
                           version ".tar.xz"))
       (sha256
        (base32
         "1h62narayrhrkqalrmx7z3s6yppw1acbp5id3skrvrygshnl1sgx"))))
    (build-system gnu-build-system)
    (arguments
     (list
      #:configure-flags
      #~(list "--disable-static"
              ;; Set default path, used when XCURSOR_PATH is unset.
              (string-append "--with-cursorpath="
                             (string-join
                              '("~/.local/share/icons" "~/.icons"
                                "~/.guix-profile/share/icons"
                                "/run/current-system/profile/share/icons"
                                "/usr/share/icons")
                              ":")))))
    (propagated-inputs
     (list libx11 libxrender libxfixes xorgproto))
    (native-inputs
     (list pkg-config))
    ;; FIXME: The search path below won't be very effective until the bugs
    ;; <http://bugs.gnu.org/20255> and <http://bugs.gnu.org/22138> are solved.
    (native-search-paths
     (list (search-path-specification
            (variable "XCURSOR_PATH")
            (files '("share/icons")))))
    (home-page "https://www.x.org/wiki/")
    (synopsis "Xorg Cursor management library")
    (description "Xorg Cursor management library.")
    (license license:x11)))
```

It is quite interesting isn't it that there is actual --with-cursorpath
which does a proper fallback?!

## What has to be changed?

Well it is hard for me to say definitely. I guess guix?! Because since it already has --with-xcursorpath 
we should not even export XCURSOR_PATH in the first place when it actually does exactly the same 
we do by adding --with-xcursorpath

## What to do?

I need to investigate further how to properly fix the issue for other users.
And investigate why it even works this way right now.
