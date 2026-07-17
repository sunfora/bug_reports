# guix bogus version tag during guix lint

I have tried to make `nasm-next` package which uses git as source (https://codeberg.org/guix/guix/pulls/9942).
Repo of nasm is currently hosted on github. 

When I tried to do `./pre-inst-env guix lint nasm-next`, as suggested in a check-up.

I've got this weird message
```text
/fork-open-source/guix [env]$ ./pre-inst-env guix lint nasm-next         
/fork-open-source/guix/gnu/packages/assembly.scm:260:13: nasm-next@3.02: can be upgraded to erified
```

The source in my new `nasm-next` package looks like this:
```scheme
(source (origin
              (method git-fetch)
              (uri (git-reference
                     (url "https://github.com/netwide-assembler/nasm")
                     (commit (string-append "nasm-" version))))
              (file-name (git-file-name name version))
              (sha256
               (base32
                "120awanzgs0xzi4mmrgs6wdn50jhj9bb9vxjjbbgpxn40g4ybwx0"))))
```

---

`guix lint` looks up stuff via `package-latest-release`
```scheme
scheme@(guix-user)> (use-modules (guix upstream))
scheme@(guix-user)> (package-latest-release nasm-next)
$2 = #<<upstream-source> package: "nasm-next" version: "erified" urls: #<<git-reference> url: "https://github.com/netwide-assembler/nasm" commit: "verified" recursive?: #f> signature-urls: #f inputs: #<promise #<procedure 7975969564b8 at guix/import/github.scm:326:9 ()>>>
```

Which then at some point (I guess, haven't step-debugged to verify, `,trace <EXPR>` in guix repl doesn't show me anything) calls this procedure:
https://codeberg.org/guix/guix/src/commit/c143f00ce73ee0603f50f70aa0846c7e1f381ed0/guix/import/github.scm#L278-L306

And I think this is where I get this weird `(v . erified)` pair.
Because 
```text
(nasm:master)$ git tag --sort=-creatordate | grep verified
verified
(nasm:master)$ git show verified
tag verified
Tagger: Cyrill Gorcunov <gorcunov@gmail.com>
Date:   Sat Jul 9 16:28:14 2011 +0400

Because of not that long ago backdoor found in
vsftpd source code (it was not signed tarball)
we desided to sign our releases just to be sure
the repo is not compromised.

So this is a first signed tag in nasm repo :)
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.11 (GNU/Linux)

iQEcBAABAgAGBQJOGEoBAAoJEMbQamTiAsNuU/QH/09uf9o6zGhoh/WB1V+nmaG8
QfkGuOUrdGDwIicCHGhuJEKS7+afVvUjzrGmro5bpd63L2ejTpHU1/vBVwmaWN21
91cjxCA/AadU+djfL7lRXJk17fP70h+HumtJdT1w/noRImvVW/41oeYStQ6VSXtb
VtwVjZXCVrqxUlHfc1dzjrm3JK0wguNFChIsX5nWL3fs1YdzRCTt+sMIQl5QL87U
ob1ZXKeMuMw85rOBV5XdSpN8nx1ePWICMZSiu4U4A7StC3qb5pjEwG4v8uEWV/39
vpgvJMxkMgtKk9ZsF9tWbpMVjM2eho7NmZft5asWUNWybSUvFVr50Gj1s3Di6EU=
=x7Jj
-----END PGP SIGNATURE-----

```

Whereas in general they do look like this
```text
(nasm:master)$ git tag --sort=-creatordate 
nasm-3.02
nasm-3.02rc13
nasm-3.02rc12
nasm-3.02rc11
nasm-3.02rc10
nasm-3.02rc9
nasm-3.02rc8
nasm-3.02rc7
nasm-3.02rc6
nasm-3.02rc5
nasm-3.02rc4
nasm-3.02rc3
nasm-3.02rc2
```

---

Maybe it should check at the end if version tag looks like a version tag?


# Status 
reported

[https://codeberg.org/guix/guix/issues/9995](https://codeberg.org/guix/guix/issues/9995)
