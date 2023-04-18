class RectangleDrawer {
    particleInit(container, particle) {
        particle.width = Math.random() * 100 + 200;
        particle.height = Math.random() * 100 + 400;
        particle.rotation = Math.random() * Math.PI * 2;
        particle.type = Math.random() < 0.5 ? "circle" : "rect";
    }

    draw(context, particle, info) {
        const { x = 0, y = 0, width = particle.width, height = particle.height, rotation = particle.rotation, type = particle.type } = info;
        if (type === "circle") {
            context.rotate(rotation);
            context.moveTo(x, y);
            context.lineTo(x + width, y);
            context.lineTo(x + width, y + height);
            context.lineTo(x, y + height);
            context.lineTo(x, y);
        } else if (type === "rect") {
            context.beginPath();
            context.arc(x, y, width / 2, 0, 2 * Math.PI);
            context.fill();
        }
    }
}

// Customize it with https://particles.js.org/samples/index.html (and export config)
async function loadParticles(config = {}) {
    await loadBaseMover(tsParticles);
    await loadCircleShape(tsParticles);
    await loadColorUpdater(tsParticles);
    await loadSizeUpdater(tsParticles);
    await loadOpacityUpdater(tsParticles);
    await loadOutModesUpdater(tsParticles);
    await loadEmittersPlugin(tsParticles);
    tsParticles.addShape("rect", new RectangleDrawer());

    let mergedConfig = mergeDeep(
        {
            fpsLimit: 120,
            fullScreen: {
                zIndex: -1,
            },
            particles: {
                number: { value: 12 },
                color: { value: ["#4285F4", "#DB4437", "#F4B400", "#0F9D58"] },
                shape: { type: "rect", options: {} },
                opacity: { value: 0.6 },
                size: { value: { min: 100, max: 300 } },
                move: {
                    enable: true,
                    angle: { value: 30, offset: 0 },
                    speed: { min: 0.2, max: 0.6 },
                    direction: "top",
                    outModes: { default: "destroy", bottom: "none" },
                },
            },
            detectRetina: true,
            emitters: {
                position: { x: 50, y: 200 },
                rate: { delay: 10, quantity: 2 },
                size: { width: 100, height: 50 },
            },
        },
        config
    );

    console.log("Particles config", mergedConfig);

    await tsParticles.load("tsparticles", mergedConfig);
}

function setBackground(description) {
    switch (description.type) {
        case "particles":
            loadParticles(description.config);
            break;
        case "css":
            document.body.style.background = description.css || "radial-gradient(#222, #111)";
            break;
        case "empty":
            break;
        default:
            console.error("Unknown background", description);
            break;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(location.search);
    if (params.has("background")) {
        let backgroundDescText = params.get("background");

        let backgroundDescription;
        try {
            backgroundDescription = JSON.parse(backgroundDescText);
        } catch (ex) {
            console.error("Could not parse background description, using default background", backgroundDescText);
            setBackground({ type: "particles" });
            return;
        }

        console.log("Setting background to", backgroundDescription);
        setBackground(backgroundDescription);
    } else {
        console.log("No background specified, using default particles");
        setBackground({ type: "particles" });
    }
});
