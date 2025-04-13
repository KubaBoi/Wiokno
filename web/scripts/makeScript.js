
async function makeDir() {
    let response = await callEndpoint("GET", `create/dir?path=${dirPath}`);
    if (response.ERROR == null) {
        getContents();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}

async function makeFile() {
    let request = {
        "DIR": dirPath
    }

    let response = await callEndpoint("POST", "create/file", request);
    if (response.ERROR == null) {
        location.reload();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}