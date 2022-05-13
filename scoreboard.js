const AIRTABLE_API_KEY = "keyKk5gJgPYyOMs3S";

async function getScores() {
    let res = await fetch("https://api.airtable.com/v0/appHzqhkCtvCp6RR7/DinoGame?sort[0][field]=score&sort[0][direction]=desc", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
    });

    if (res.ok) {
        let obj = await res.json();
        return obj.records;
    } else {
        console.error("Error", await res.text());
        return [];
    }
}

async function publishScore(name, score) {
    let scores = await getScores();

    console.log(scores);

    let existingScore = scores.find((e) => e.fields.name === name);
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
