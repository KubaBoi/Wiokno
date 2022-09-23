
async function makeDir() {

}

async function makeFile() {
    var request = {
        "DIR": dirPath
    }

    var response = await callEndpoint("POST", "/create/file", request);
    if (response.ERROR != null) {
        showWrongAlert("ERROR", response.ERROR, alertTime);
    }
    else {
        location.reload();
    }
}