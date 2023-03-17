function printPage() {
    let headLine = document.getElementById("headLine");
    let navDiv = document.getElementById("navigationDiv");
    let md = document.getElementById("md");
    headLine.style.visibility = "hidden";
    navDiv.style.visibility = "hidden";
    let w = md.style.width;
    let p = md.style.padding;
    let m = md.style.margin;
    let b = md.style.border;
    md.style.width = "100%";
    md.style.padding = "0";
    md.style.margin = "0";
    md.style.border = "none";
    print();
    headLine.style.visibility = "visible";
    navDiv.style.visibility = "visible";
    md.style.width = w;
    md.style.padding = p;
    md.style.margin = m;
    md.style.border = b;
}