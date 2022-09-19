const AIRTABLE_API_KEY = "keyKk5gJgPYyOMs3S";

async function getRandomQuote() {
    let res = await fetch("https://api.airtable.com/v0/appHzqhkCtvCp6RR7/Quotes", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
    });

    if (res.ok) {
        let data = await res.json();
        if (data.records.length <= 0) return "";
        let randomIndex = Math.floor(Math.random() * data.records.length);
        return data.records[randomIndex].fields.quote;
    } else {
        return "";
    }
}

async function getCards() {
    let res = await fetch("https://api.airtable.com/v0/appHzqhkCtvCp6RR7/Cards", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
    });

    if (res.ok) {
        let data = await res.json();
        return data.records.map((e) => e.fields);
    } else {
        return [];
    }
}

async function getScores(maxRecords = 100) {
    let res = await fetch(
        "https://api.airtable.com/v0/appHzqhkCtvCp6RR7/DinoGame?sort[0][field]=score&sort[0][direction]=desc&maxRecords=" + maxRecords,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            },
        }
    );

    if (res.ok) {
        let obj = await res.json();
        return obj.records;
    } else {
        console.error("Error", await res.text());
        return [];
    }
}

async function getRank(name) {
    let scores = await getScores();
    return scores.findIndex((e) => e.fields.name === name) + 1;
}

async function getScore(name) {
    let res = await fetch(
        `https://api.airtable.com/v0/appHzqhkCtvCp6RR7/DinoGame?filterByFormula=${encodeURIComponent(`{name}='${name}'`)}&maxRecords=1`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            },
        }
    );

    if (res.ok) {
        let obj = await res.json();
        return obj.records[0];
    } else {
        return [];
    }
}

async function publishScore(name, score) {
    let existingScore = await getScore(name);
    if (existingScore) {
        if (existingScore.fields.score >= score) {
            // Score didn't improve
            return;
        }

        // Set new score for name
        let res = await fetch("https://api.airtable.com/v0/appHzqhkCtvCp6RR7/DinoGame", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                records: [
                    {
                        id: existingScore.id,
                        fields: {
                            score: score,
                        },
                    },
                ],
            }),
        });

        return res.ok;
    } else {
        // Insert new score
        let res = await fetch("https://api.airtable.com/v0/appHzqhkCtvCp6RR7/DinoGame", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                records: [
                    {
                        fields: {
                            name: name,
                            score: score,
                            version: 1,
                        },
                    },
                ],
            }),
        });

        return res.ok;
    }
}
