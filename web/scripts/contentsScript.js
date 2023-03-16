
async function getContents() {
    let response = await callEndpoint("GET", `/search/dir?path=${dirPath}`);
    if (response.ERROR == null) {

        let dirs = response.DIRS;
        let files = response.FILES;

        dirPath = dirPath.replaceAll("\\", "/");
        document.getElementById("contP").innerHTML = dirPath;

        let contUl = document.getElementById("contUl");
        clearTable(contUl);

        // SELF
        createElement("li", contUl, `<label>> <a href="/page.html?d=${dirPath}">.</a></label>`);

        // PARENT DIRECTORY
        let parentPath = dirPath.split("/");
        parentPath.pop();
        parentPath = parentPath.join("/");
        if (parentPath == "") parentPath = "/";
        createElement("li", contUl, `<label>> <a href="/page.html?d=${parentPath}">..</a></label>`);

        // SLAVE DIRECTORIES
        for (let i = 0; i < dirs.length; i++) {
            let dir = dirs[i];
            createElement("li", contUl, `<label>> <a href="/page.html?d=${dirPath}/${dir}">${dir}</a></label>`);
        }

        // FILES
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            createElement("li", contUl, `<a href="/page.html?d=${dirPath}&f=${file}">${file}</a>`);
        }
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}