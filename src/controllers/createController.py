
import os

from Cheese.cheeseController import CheeseController as cc
from Cheese.resourceManager import ResMan
from Cheese.httpClientErrors import *

#@controller /create;
class CreateController(cc):

    #@get /dir;
    @staticmethod
    def dir(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["path"], args)

        return cc.createResponse({"STATUS": "OK"})

    #@post /file;
    @staticmethod
    def file(server, path, auth):
        args = cc.readArgs(server)
        cc.checkJson(["DIR"], args)

        directory = ResMan.web("files", args["DIR"])

        file_name = "New note"
        i = 0
        while (os.path.exists(ResMan.joinPath(directory, file_name + ".md"))):
            i += 1
            file_name = f"New note ({i})"
        
        path = ResMan.joinPath(directory, file_name + ".md")

        with open(path, "w") as f:
            f.write(f"# {file_name}")

        return cc.createResponse({"FILE_NAME": ResMan.joinPath(directory, file_name + ".md")})

    #@post /update;
    @staticmethod
    def update(server, path, auth):
        args = cc.readArgs(server)
        cc.checkJson(["FILE", "CONTENT"], args)

        file = args["FILE"]
        content = args["CONTENT"]

        lines = content.split("\n")
        file_name = "noname.md"
        for line in lines:
            if (line.startswith("# ")):
                file_name = line.replace("# ", "")
                break

        os.remove(ResMan.web(file))
        file = file.replace(ResMan.getFileName(file), file_name + ".md") 

        with open(ResMan.web(file), "w") as f:
            f.write(args["CONTENT"])

        return cc.createResponse({"FILE_NAME": file})