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

// For backwards compatibility
let backgroundHasBeenSetUp = false;

function setBackground(description) {
    console.log("set background", description);

    if (description.customCss) {
        let styleEl = document.createElement("style");
        styleEl.innerText = description.customCss;
        document.body.appendChild(styleEl);
    }

    if (description.fontFamily) {
        document.body.style.fontFamily = `"${description.fontFamily}", sans-serif`;

        // Create <link href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Poppins:wght@300&display=swap" rel="stylesheet">
        let linkEl = document.createElement("link");
        linkEl.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(description.fontFamily)}&display=swap`;
        linkEl.rel = "stylesheet";
        document.head.appendChild(linkEl);
    }

    switch (description.type) {
        case "blank":
            break;
        case "particles":
            loadParticles(typeof description.config === "string" ? JSON.parse(description.config) : description.config);
            break;
        case "color":
            document.body.style.background = description.color;
            break;
        case "url":
            if (description.url.startsWith("https://www.youtube.com/")) {
                let ytUrl = new URL(description.url);
                let ytEmbedUrl = `https://www.youtube.com/embed/${ytUrl.searchParams.get("v")}?autoplay=1&controls=0&loop=1&mute=1`; // Make sure to mute, otherwise autoplay won't work!

                let iframeEl = document.createElement("iframe");
                iframeEl.setAttribute("id", "ytplayer");
                iframeEl.setAttribute("type", "text/html");
                iframeEl.setAttribute("width", String(window.innerWidth));
                iframeEl.setAttribute("height", String(window.innerHeight));
                iframeEl.setAttribute("src", ytEmbedUrl);
                iframeEl.setAttribute("frameborder", String(0));
                iframeEl.setAttribute("allow", "autoplay; fullscreen");
                iframeEl.style.position = "absolute";
                iframeEl.style.inset = "0";
                iframeEl.style.zIndex = -1;

                document.body.appendChild(iframeEl);
            } else {
                console.error("Could not render url background", description);
            }
            break;
        case "media":
            if (description.mediaFile) {
                document.body.style.background = `url(${description.mediaFile})`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.backgroundPosition = "center";
            } else {
                console.error("Could not render media background", description);
            }
            break;

        default:
            console.error("Unknown background", description);
            break;
    }

    backgroundHasBeenSetUp = true;
}

setTimeout(() => {
    if (!backgroundHasBeenSetUp) {
        console.log("No background specified, using default particles");
        setBackground({ type: "particles" });
    }
}, 250);
