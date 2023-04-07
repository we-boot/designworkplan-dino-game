let pubnub = new PubNub({
    publishKey: "pub-c-11a13158-acff-4307-85c9-aa2948d65e7c",
    subscribeKey: "sub-c-87a3e456-cbb2-11ec-ba93-a6fdca316470",
    uuid: "d48b85ce-9923-4f55-9040-f5e7096c4cda", // Just a random UUID
});

pubnub.addListener({
    status: function (statusEvent) {
        console.log("Status event", statusEvent);
    },
    message: function (msg) {
        console.log("Incoming message", msg.message);
        window.dispatchEvent(new CustomEvent("pubnub", { detail: msg }));
    },
    presence: function (presenceEvent) {
        console.log("Presence event", presenceEvent);
    },
});

function subscribeRoom(roomId) {
    pubnub.subscribe({
        channels: ["game-" + roomId],
    });
}

function subscribeSequence(sequenceId) {
    pubnub.subscribe({
        channels: ["sequence-" + sequenceId],
    });
}

let roomId = new URLSearchParams(location.search).get("roomId") || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
console.log("Room id", roomId);

window.addEventListener("pubnub", (ev) => {
    // console.log("Received pubnub event", ev);

    let message = ev.detail.message;
    if (message.type === "connected") {
        // Game has started, redirect to game screen
        location.href = WEBSITE_ROOT + `/screen/game/${message.game}?roomId=${encodeURIComponent(roomId)}&name=${encodeURIComponent(message.name)}`;
    } else {
        console.warn("Received unknown pubnub message", message);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    subscribeRoom(roomId);
});
