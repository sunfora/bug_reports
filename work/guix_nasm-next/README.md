# guix nasm, pdf docs are stripped, tests are bogus

This change introduces ~~nasm-3.02~~ `nasm-next`
(among current 2.XX to avoid world rebuild)

Differences from current nasm package:
- **builds from git, not from tarball**
   this requires `autoconf-2.72`, `automake`, `which` for 'bootstrap phase
   manpages are generated, so new deps: `asciidoc`, `xmlto`, `docbook-xsl`
   
   as a bonus one can build from latest commit on master `--with-branch=nasm-next=master`
   or hack on nasm with `guix shell -D nasm-next`

    initially I thought to just add 3.02 to my private channel to test if the issue I had with -g -F dwarf
    was fixed by upstream, then was nerdsniped into fixing ghostscript reproducibility 
    and thought the work I have done was valuable enough as is

    but after Yelninei's comment, I reconsidered that adding nasm-next from git is even better idea
  
- **pdf documentation generation is reintroduced** 
  (I think I have fixed all reproducibility issues)

  new deps: 
  - fonts: `font-google-roboto`, `font-google-roboto-mono` 
  - perl libraries: `perl-font-ttf`, `perl-sort-versions`
  - `fontconfig`
  - `ghostscript`
  
   as Yelninei pointed out this creates a cyclic dependency due to `libturbo`
   if one would be to update the current `nasm@2`, I think the good idea is to introduce `nasm-minimal`
   which would be dependent only on `perl` and `python-wrapper` for running tests
   
   and replace libturbo's nasm with nasm-minimal

- **`texinfo` dep is dropped**
    _reason being:_ since 2017 nasm no longer generates and supports info pages

- **`python-wrapper` is added as dep**
    _reason being:_ nasm used travis target for tests for quite some time 
    and a week ago on branch master travis target took place of legacy perl scripts
    now it is both perl and python

~~Also bunch of ignored errors are fixed in check phase.
I added 'make golden' phase prior to check.~~

---

Historically around 2016 when nasm was
introduced into guix by Jan Nieuwenhuizen

commit: 8472bdecb634e2f3015a61e16c59b62831b82ea9

It suffered from bunch of reproducibility issues, most importantly:
the pdf documentation generation was not reproducible.
Later, around that time, pdf documentation was fixed
through removal of pdf documentation in make file.

First via patch (Jan Nieuwenhuizen),
later via introduced substitute* phase (Efraim Flashner)

commit: a837997cab842026bde1d5c0fac3a2d5258fe06f
commit: 161fb9be8edf37cf52c3d223214d81e4cbb7a787

Since then the package was mostly version bumped
to meet latest version of nasm and resolve building issues
because of removed pdf.

---

I have found out that Debian around 2017
fixed several reproducibility issues for their nasm packages.

Which are still relevant today.

patches:
https://sources.debian.org/patches/nasm/3.01-1/
https://sources.debian.org/patches/nasm/3.01-1/0007-doc-sort-keys-for-reproducibility.patch/
https://sources.debian.org/patches/nasm/3.01-1/0003-debian-debian-patches-04-reproducible-build.patch.patch/

discussion:
https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=820194

**upd:**
Initially thought to use these patches. 
But ended up using env vars like `PERL_HASH_SEED`, `GS_GENERATE_UUIDS` instead.

reasons: 
1. it is simpler
2. date patch messes with travis tests

---

The last `GS_GENERATE_UUIDS` fixes the issue with ghostscript adding /CreationDate to the document
the behavior of this `GS_GENERATE_UUIDS` env var was introduced into guix around 2021.

https://issues.guix.gnu.org/issue/49640
commit: db5962c68099f835350c24c8a3f889b9fa1f8a8e

---

<!--
Below is a checklist for package-related patches.

For details please refer to [the manual](https://guix.gnu.org/manual/devel/en/html_node/Submitting-Patches.html).

Common issues in the contribution process are also documented in the
["Contributing" chapter](https://guix.gnu.org/manual/devel/en/html_node/Contributing.html)
of the manual.

Tick a box by changing it from [ ] to [x].
-->

- System(s) where you built it (successfully):
  - [x] x86_64-linux
  - [ ] i686-linux
  - [ ] aarch64-linux
  - [ ] armhf-linux
  - [ ] powerpc64le-linux
  - [ ] riscv64-linux
  - [ ] x86_64-gnu
  - [ ] i586-gnu

- Package **update**
  - Closure size increase.
```console
$ guix size nasm | tail -n1 # before
total: 78.1 MiB
$ ./pre-inst-env guix size nasm-next | tail -n1 # after
total: 79.6 MiB
```
  - Build status of direct dependents (`./pre-inst-env guix build -k -P1 nasm-next`):
```text
/gnu/store/8srdrmzbaqlwqbs82vjki1r86psbz42l-nasm-next-3.02
```
  - Link to upstream release notes (if applicable):
```text
https://www.nasm.us/doc/nasmac.html
```
- Package **addition**
  - [x] The packages includes tests when available.
  - [x] Closure size given by `guix size`.
  - [ ] Fixed errors reported by `guix lint` (`./pre-inst-env guix lint nasm-next`).
  - [x] Verified cryptographic signature provided by upstream.
  - [x] The packages don't use bundled copies of software.
  - [x] Synopsis and description are written in conformance with [the guidelines](https://guix.gnu.org/manual/devel/en/html_node/Synopses-and-Descriptions.html).

- [ ] Commit messages follow [the "ChangeLog" style](https://www.gnu.org/prep/standards/html_node/Change-Logs.html).
- [x] The change doesn't break `guix pull` (`guix pull --url=/path/to/your/checkout --profile=/tmp/guix.master --no-channel-files --disable-authentication`).

- Successfully cross-compiled to the following target(s) (this is optional):
  - [ ] x86_64-linux-gnu
  - [ ] i686-linux-gnu
  - [ ] aarch64-linux-gnu
  - [ ] arm-linux-gnueabihf
  - [ ] powerpc64le-linux-gnu
  - [ ] riscv64-linux-gnu
  - [ ] x86_64-pc-gnu
  - [ ] i586-pc-gnu
 
- Reproducibility  `./pre-inst-env guix build --check nasm-next`
```text
successfully built /gnu/store/w2v7r87vwcifxxx24ksf5s5ahpccvkgk-nasm-next-3.02.drv
successfully built /gnu/store/w2v7r87vwcifxxx24ksf5s5ahpccvkgk-nasm-next-3.02.drv
/gnu/store/8srdrmzbaqlwqbs82vjki1r86psbz42l-nasm-next-3.02
```

## Status
pull request made

[https://codeberg.org/guix/guix/pulls/9942](https://codeberg.org/guix/guix/pulls/9942)
