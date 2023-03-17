
import os

from Cheese.cheeseController import CheeseController as cc
from Cheese.resourceManager import ResMan
from Cheese.httpClientErrors import *

#@controller /search;
class SearchController(cc):

    #@get /dir;
    @staticmethod
    def dir(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["path"], args)

        ret_files = []
        ret_dirs = []

        pth = SearchController.removeDuplicates(args["path"])

        for root, dirs, files in os.walk(ResMan.web("files", pth)):
            ret_dirs = dirs
            
            for file in files:
                if (file == "dirConf.md"): continue
                if (file.endswith(".md")): ret_files.append(file[:-3])

            break
        
        return cc.createResponse({"DIRS": sorted(ret_dirs), "FILES": sorted(ret_files)})

    # METHODS

    @staticmethod
    def removeDuplicates(str):
        pth = ""
        add = True
        for ch in str:
            if (ch == "/" or ch == "\\"):
                if (add):
                    pth += "/"
                    add = False
            else:
                pth += ch
                add = True
        return pth