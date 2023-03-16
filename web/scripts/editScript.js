
async function sourceEdit() {
    let navigationDiv = document.getElementById("navigationDiv");
    let sourceDiv = document.getElementById("source");
    if (sourceDiv == null) {
        navigationDiv.style.visibility = "hidden";
        let d = document.getElementById("d");
        let sourceDiv = createElement("div", d, "", [
            {"name": "id", "value": "source"},
            {"name": "class", "value": "main"}
        ]);

        let response = await callEndpoint("GET", mdUrl);
        if (response.ERROR == null) {
            createElement("textarea", sourceDiv, response, [
                {"name": "id", "value": "sourceInput"},
                {"name": "class", "value": "sourceInput"},
                {"name": "columns", "value": "500"},
                {"name": "rows", "value": "500"}
            ]);
        }
    }
    else {
        sourceDiv.remove();
        navigationDiv.style.visibility = "visible";
    }
}

async function save() {
    let sourceDiv = document.getElementById("sourceInput");

    if (sourceDiv == null) {
        return;
    }

    let content = sourceDiv.value;
    let request = {
        "FILE": mdUrl,
        "CONTENT": content
    }
    
    let response = await callEndpoint("POST", "/create/update", request);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
    }
    else {        
        dirPath = response.DIR;
        fileName = response.FILE_NAME;

        getMd(`/files/${dirPath}/${fileName}`, false);
        getContents(dirPath);
        let resp= await callEndpoint("GET", mdUrl);
        if (resp.ERROR == null) 
            sourceDiv.value = resp;
        else
            alert("Error, do not save!! Close edit and open it again.");
    }
}

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        // Prevent the Save dialog to open
        e.preventDefault();
        // Place your code here
        save();
    }
});