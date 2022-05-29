window.addEventListener("keydown", (ev) => {
    let url = undefined;
    switch (ev.key) {
        case "1":
            url = "/screen/index.html";
            break;
        case "2":
            url = "/screen/blocks.html";
            break;
        case "3":
            url = "/screen/sign.html?title=Entrance&rotation=0";
            break;
        case "4":
            url = "/screen/qr.html";
            break;
    }

    if (url) {
        location.href = WEBSITE_ROOT + url;
    }
});
