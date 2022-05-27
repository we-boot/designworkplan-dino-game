window.addEventListener("keydown", (ev) => {
    let url = undefined;
    switch (ev.key) {
        case "1":
            url = "/screen/index.html";
            break;
        case "2":
            url = "/screen/static.html";
            break;
        case "3":
            url = "/screen/sign.html?name=Entrance";
            break;
    }

    if (url) {
        location.href = url;
    }
});
