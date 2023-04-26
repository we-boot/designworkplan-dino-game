// This file should be loaded after all other files!

function setupScene(scene) {
    console.log("Setting up scene", scene);

    // Set up 'margin'
    document.body.style.padding = `${scene.topMargin || 0} ${scene.rightMargin || 0} ${scene.bottomMargin || 0} ${scene.leftMargin || 0}`;

    if (scene.background) {
        setBackground(scene.background);
    }

    // Allow different scenes to implement different initializations
    window.dispatchEvent(new CustomEvent("scene", { detail: { scene: scene } }));
}

window.addEventListener("message", (ev) => {
    if (ev.data.type === "scene") {
        setupScene(ev.data.scene.item);
    }
});

function legacySceneSetup() {
    const params = new URLSearchParams(location.search);
    if (!params.has("v")) {
        let scene = Object.fromEntries(params.entries());
        console.log("Extracted scene settings from params", scene);
        setupScene(scene);
    }
}

legacySceneSetup();
