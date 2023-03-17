
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
            let sourceInput = createElement("textarea", sourceDiv, response, [
                {"name": "id", "value": "sourceInput"},
                {"name": "class", "value": "sourceInput"},
                {"name": "columns", "value": "500"},
                {"name": "rows", "value": "500"}
            ]);
            sourceInput.focus();
            sourceInput.addEventListener('keydown', e => {
                if (e.shiftKey && e.keyCode == 9) {
                    e.preventDefault();
                    let start = sourceInput.selectionStart;
                    let end = sourceInput.selectionEnd;
                    let value = sourceInput.value;
                    let selection = value.slice(start, end);
                    let lines = selection.split("\n");
                    for (let i = 0; i < lines.length; i++) 
                        for (let o = 0; o < 4; o++)
                            if (lines[i][0] == " ")
                                lines[i] = lines[i].slice(1);
                    
                    sourceInput.value = value.slice(0, start) + lines.join("\n") + value.slice(end);
                    sourceInput.selectionStart = start - 4;
                    sourceInput.selectionEnd = end - 4;
                }
                else if (e.keyCode == 9) {
                    e.preventDefault();
                    let start = sourceInput.selectionStart;
                    let end = sourceInput.selectionEnd;
                    let value = sourceInput.value;
                    let selection = value.slice(start, end);
                    let lines = selection.split("\n");
                    for (let i = 0; i < lines.length; i++) 
                        lines[i] = "    " + lines[i];
                    
                    sourceInput.value = value.slice(0, start) + lines.join("\n") + value.slice(end);
                    sourceInput.selectionStart = start + 4;
                    sourceInput.selectionEnd = end + (4 * (lines.length));
                }
            });
        }
        else {
            sourceDiv.remove();
            alert(`Error ${response.ERROR}`);
        }
    }
    else {
        sourceDiv.remove();
        navigationDiv.style.visibility = "visible";
    }
}

async function save() {
    let sourceInput = document.getElementById("sourceInput");

    if (sourceInput == null) {
        return;
    }

    let content = sourceInput.value;
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
            sourceInput.value = resp;
        else
            alert("Error, do not save!! Close edit and open it again.");
    }
}

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        save();
    }
    if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        sourceEdit();
    }
});