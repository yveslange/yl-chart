agChart
=======
Chart librairie for Web application with interactive options.


Installation
============
* install nodeJS: pacman -S nodejs
* make install


Compiling
=========
make build: normal compilation with `*.map` and not minified. A release copy will be added.

make build-prod: minified version without `*.map`. A release copy will be added.


Watch
=====
make watch: watch changes with auto-reload script


JavaScript dependencies
=======================
* jQuery: ~2.1
* D3JS: ~3.3


TODO
====
* Remove window.brunch.server for watcher in production
* Add `make clean` in *Makefile* to clean the project
