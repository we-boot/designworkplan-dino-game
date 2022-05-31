window.addEventListener("keydown", (ev) => {
    let url = undefined;
    switch (ev.key) {
        case "1":
            url = "/screen";
            break;
        case "2":
            url = "/screen/blocks";
            break;
        case "3":
            url = "/screen/sign?title=Entrance&rotation=0";
            break;
        case "4":
            url = "/screen/sign?title=Google%20L8%20Demo&rotation=0";
            break;
        case "5":
            url = "/screen/sign?title=MicroKitchen%20Late%20Night%20Snacks&rotation=180";
            break;
        case "0":
            url = "/screen/qr";
            break;
    }

    if (url) {
        location.href = WEBSITE_ROOT + url;
    }
});
