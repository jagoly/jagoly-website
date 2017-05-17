#!/usr/bin/env python3

from staticjinja import make_site

from glob import glob
from os import mkdir
from subprocess import run
from shutil import rmtree, copytree


if __name__ == "__main__":

    # compile SASS style sheets
    run("sass --update --force --style=compact --sourcemap=none sass:static/styles", shell=True)
    
    # clear build directory
    
    try: rmtree("./www")
    except FileNotFoundError: pass
    
    mkdir("./www")
    
    # render jinja templates

    site = make_site (
        searchpath  = "./source",
        outpath     = "./www",
        staticpaths = ["./static"]
    )
    
    site._env.trim_blocks = True
    site._env.lstrip_blocks = True
    
    site.render()
    
    # copy static resources    
    copytree("./static", "./www/static/")
    
    # todo: give decent error on failure
    # todo: recursion into sub-directories
    run("tidy -config tidy.txt -modify www/*.html", shell=True)

