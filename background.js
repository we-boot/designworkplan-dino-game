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

async function loadParticles() {
    await loadBaseMover(tsParticles);
    await loadCircleShape(tsParticles);
    await loadColorUpdater(tsParticles);
    await loadSizeUpdater(tsParticles);
    await loadOpacityUpdater(tsParticles);
    await loadOutModesUpdater(tsParticles);
    await loadEmittersPlugin(tsParticles);
    tsParticles.addShape("rect", new RectangleDrawer());

    // Customize it with https://particles.js.org/samples/index.html
    await tsParticles.load("tsparticles", {
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
    });
}
