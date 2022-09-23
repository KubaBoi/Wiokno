
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

        for root, dirs, files in os.walk(ResMan.web("files", args["path"])):
            ret_dirs = dirs
            
            for file in files:
                if (file.endswith(".md")): ret_files.append(file[:-3])

            break
        
        return cc.createResponse({"DIRS": ret_dirs, "FILES": ret_files})