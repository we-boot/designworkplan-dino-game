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
        case "text":
            return "/screen/sign";
        default:
            throw new Error("Unknown scene type " + sceneType);
    }
}

function getSceneUrl(sequence, index, repeat, roomId = null) {
    let scene = sequence[index];
    let url = WEBSITE_ROOT + getPathForSceneType(scene.type);

    let params = new URLSearchParams();
    for (let k in scene) {
        params.set(k, scene[k]);
    }

    // These are gathered from path/current scene
    params.delete("duration");

    params.set("seq", JSON.stringify(sequence));
    params.set("seqi", index);
    params.set("seqr", String(repeat));
    if (roomId !== null) {
        params.set("roomId", roomId);
    }

    return url + "?" + params.toString();
}

let nextSceneUrl = null;
let sceneTransitionHandle = null;

function runSequence() {
    let params = new URLSearchParams(location.search);

    if (!params.has("seq")) {
        return;
    }

    let roomId = params.has("roomId") ? params.get("roomId") : "default";
    let sequenceString = params.get("seq");
    let sequence = JSON.parse(sequenceString);
    let repeatSequence = params.has("seqr") ? params.get("seqr") === "true" : true;

    if (!params.has("seqi")) {
        // Goto first scene
        location.href = getSceneUrl(sequence, 0, repeatSequence, roomId);
        return;
    }

    let sequenceIndex = parseInt(params.get("seqi"));
    let currentScene = sequence[sequenceIndex];

    let nextIndex = sequenceIndex + 1;
    if (nextIndex >= sequence.length) {
        if (repeatSequence) {
            nextIndex = 0;
            console.log("Reached end of sequence, repeating");
        } else {
            console.log("Reached end of sequence, not repeating because it is disabled");
            return;
        }
    }

    nextSceneUrl = getSceneUrl(sequence, nextIndex, repeatSequence, roomId);
    console.log("Next scene", nextSceneUrl);

    let delay = currentScene.duration * 1000;
    if (currentScene.type === "countdown") {
        let diffMs = new Date(currentScene.to).getTime() - new Date().getTime();
        if (diffMs > 0) {
            delay += diffMs;
        }
    }

    setTransitionDelay(delay);
}

function setTransitionDelay(delay) {
    if (sceneTransitionHandle) {
        clearTimeout(sceneTransitionHandle);
        sceneTransitionHandle = null;
    }

    if (delay !== null) {
        console.log("Transitioning to next scene in %d seconds", delay / 1000);
        sceneTransitionHandle = setTimeout(() => (location.href = nextSceneUrl), delay);
    }
}

function getNextSceneUrl() {
    return nextSceneUrl;
}

runSequence();
