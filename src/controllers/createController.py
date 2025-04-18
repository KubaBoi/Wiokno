
import os
import shutil

from Cheese.cheeseController import CheeseController as cc
from Cheese.resourceManager import ResMan
from Cheese.httpClientErrors import *

from src.controllers.searchController import SearchController

#@controller /create;
class CreateController(cc):

    #@get /dir;
    @staticmethod
    def dir(server, path, auth):
        args = cc.getArgs(path)
        cc.checkJson(["path"], args)

        pth = SearchController.removeDuplicates(args["path"])

        directory = ResMan.web("files", pth)

        dir_name = "New directory"
        i = 0
        while (os.path.exists(ResMan.joinPath(directory, dir_name))):
            i += 1
            dir_name = f"New directory ({i})"
        
        path = ResMan.joinPath(directory, dir_name)
        os.makedirs(path)

        with open(os.path.join(path, "dirConf.md"), "w", encoding="utf-8") as f:
            f.write(f"""
# {dir_name}
            """)

        return cc.createResponse({"DIR": path})

    #@post /file;
    @staticmethod
    def file(server, path, auth):
        args = cc.readArgs(server)
        cc.checkJson(["DIR"], args)

        dir = SearchController.removeDuplicates(args["DIR"])

        directory = ResMan.web("files", dir)

        file_name = "New file"
        i = 0
        while (os.path.exists(ResMan.joinPath(directory, file_name + ".md"))):
            i += 1
            file_name = f"New file ({i})"
        
        path = ResMan.joinPath(directory, file_name + ".md")

        with open(path, "w", encoding="utf-8") as f:
            f.write(f"# {file_name}")

        return cc.createResponse({"FILE_NAME": ResMan.joinPath(directory, file_name + ".md")})

    #@post /update;
    @staticmethod
    def update(server, path, auth):
        args = cc.readArgs(server)
        cc.checkJson(["FILE", "CONTENT"], args)

        file = SearchController.removeDuplicates(args["FILE"])
        content = args["CONTENT"]

        file_name = ResMan.getFileName(file)
        if (file_name == "dirConf.md"):
            return CreateController.updateDirConf(file, content)

        lines = content.split("\n")
        file_name = "noname.md"
        for line in lines:
            if (line.startswith("# ")):
                file_name = line.replace("# ", "").strip() + ".md"
                break

        new_file = ResMan.web(file.replace(ResMan.getFileName(file), file_name))

        if (file_name != ResMan.getFileName(file)):
            if (os.path.exists(new_file)):
                raise Conflict("This file already exists")

        os.remove(ResMan.web(file))

        if (file_name == "xxxxx.md"):
            return cc.createResponse({
                "DIR": SearchController.removeDuplicates(
                    ResMan.getRelativePathFrom(os.path.dirname(new_file), ResMan.web("files"))),
                "FILE_NAME": "dirConf.md"
            })

        with open(new_file, "w", encoding="utf-8") as f:
            f.write(args["CONTENT"])

        return cc.createResponse({
            "DIR": SearchController.removeDuplicates(
                ResMan.getRelativePathFrom(os.path.dirname(new_file), ResMan.web("files"))),
            "FILE_NAME": file_name
        })

    # METHODS

    @staticmethod
    def updateDirConf(file, content):
        dir = os.path.dirname(ResMan.web(file))

        lines = content.split("\n")
        dir_name = "noname"
        for line in lines:
            if (line.startswith("# ")):
                dir_name = line.replace("# ", "").strip()
                break

        if (file != "files/dirConf.md"):
            new_dir = os.path.join(os.path.dirname(dir), dir_name)
        else:
            new_dir = dir

        if (ResMan.getFileName(new_dir) != ResMan.getFileName(dir) and os.path.exists(new_dir)):
            raise Conflict("This directory already exists")

        with open(ResMan.web(file), "w", encoding="utf-8") as f:
            f.write(content)

        os.rename(dir, new_dir)

        if (file != "files/dirConf.md" and dir_name == "xxxxx"):
            shutil.rmtree(new_dir)
            new_dir = os.path.dirname(new_dir)

        return cc.createResponse({
            "DIR": SearchController.removeDuplicates(
                ResMan.getRelativePathFrom(new_dir, ResMan.web("files"))),
            "FILE_NAME": "dirConf.md"
        })