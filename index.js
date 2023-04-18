const WEBSITE_ROOT = location.hostname === "localhost" ? "http://localhost:3000" : "https://we-boot.github.io/designworkplan-dino-game";
const NO_ACTIVITY_TIME = 1000 * 60;

function mergeDeep(...objects) {
    const isObject = (obj) => obj && typeof obj === "object";

    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach((key) => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                // prev[key] = pVal.concat(...oVal);
                prev[key] = oVal;
            } else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });

        return prev;
    }, {});
}
