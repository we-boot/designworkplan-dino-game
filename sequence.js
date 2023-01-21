function getPathForSceneType(sceneType) {
    switch (sceneType) {
        case "screensaver":
            return "/screen/blocks";
        case "digital-clock":
            return "/screen/";
        case "arrow":
            return "/screen/sign";
        case "multi-arrow":
            return "/screen/multi-sign";
        case "doodle":
            return "/screen/doodle";
        case "analog-clock":
            return "/screen/analog-clock";
        case "game":
            return "/screen/qr";
        case "countdown":
            return "/screen/countdown";
        case "cards":
            return "/screen/cards";
        case "media":
            return "/screen/media";
        default:
            throw new Error("Unknown scene type " + sceneType);
    }
}

function gotoScene(scenes, index) {
    let scene = scenes[index];
    let url = WEBSITE_ROOT + getPathForSceneType(scene.type);

    let params = new URLSearchParams();
    for (let k in scene) {
        params.set(k, scene[k]);
    }

    // These are gathered from path/current scene
    params.delete("type");
    params.delete("duration");

    params.set("seq", JSON.stringify(scenes));
    params.set("seqi", index);

    location.href = url + "?" + params.toString();
}

function runSequence() {
    let params = new URLSearchParams(location.search);

    if (!params.has("seq")) {
        return;
    }

    let seq = params.get("seq");
    let scenes = JSON.parse(seq);

    if (!params.has("seqi")) {
        // Goto first scene
        gotoScene(scenes, 0);
        return;
    }

    let sceneIndex = parseInt(params.get("seqi"));
    let currentScene = scenes[sceneIndex];
    let repeat = true;

    let nextIndex = sceneIndex + 1;
    if (nextIndex >= scenes.length) {
        if (repeat) {
            nextIndex = 0;
            console.log("Reached end of sequence, repeating");
        } else {
            console.log("Reached end of sequence, not repeating because it is disabled");
            return;
        }
    }

    let delay = currentScene.duration * 1000;
    if (currentScene.type === "countdown") {
        let diffMs = new Date(currentScene.to).getTime() - new Date().getTime();
        if (diffMs > 0) {
            delay += diffMs;
        }
    }

    console.log("Transitioning to scene %d in %d seconds", nextIndex, delay / 1000);
    setTimeout(() => gotoScene(scenes, nextIndex), delay);
}

runSequence();
