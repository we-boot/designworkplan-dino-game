const WEBSITE_ROOT = "http://localhost:3000";
const NO_ACTIVITY_TIME = 1000 * 60;

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

pubnub.subscribe({
    channels: ["game"],
});
