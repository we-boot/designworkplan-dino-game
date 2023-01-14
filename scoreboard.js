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

async function getScores(game, maxRecords = 100) {
    let res = await fetch(
        `https://api.airtable.com/v0/appHzqhkCtvCp6RR7/DinoGame?filterByFormula=${encodeURIComponent(
            `{game}='${game}'`
        )}&sort[0][field]=score&sort[0][direction]=desc&maxRecords=${encodeURIComponent(String(maxRecords))}`,
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

async function getRank(game, name) {
    let scores = await getScores(game);
    return scores.findIndex((e) => e.fields.name === name) + 1;
}

async function getScore(game, name) {
    let res = await fetch(
        `https://api.airtable.com/v0/appHzqhkCtvCp6RR7/DinoGame?filterByFormula=${encodeURIComponent(
            `AND({name}='${name}',{game}='${game}')`
        )}&maxRecords=1`,
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

async function publishScore(game, name, score) {
    let existingScore = await getScore(game, name);
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
                            game: game,
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

async function updateScoreTable(game, markName, elementId = "score-table-body") {
    let tbody = document.getElementById(elementId);

    let scores = await getScores(game);

    while (tbody.firstChild) {
        tbody.firstChild.remove();
    }

    for (let i = 0; i < scores.length; i++) {
        let score = scores[i];

        let rowElement = document.createElement("tr");

        if (score.fields.name === markName) {
            rowElement.style.backgroundColor = "#0001";
        }

        let rankElement = document.createElement("td");
        rankElement.innerText = i + 1;
        rowElement.appendChild(rankElement);
        let nameElement = document.createElement("td");
        nameElement.innerText = score.fields.name;
        rowElement.appendChild(nameElement);
        let scoreElement = document.createElement("td");
        scoreElement.innerText = score.fields.score;
        rowElement.appendChild(scoreElement);
        tbody.appendChild(rowElement);
    }
}

async function updateRankText(game, name) {
    let rank = await getRank(game, name);
    let rankElement = document.getElementById("rank-text");
    rankElement.innerText = rank === 0 ? "" : `Je staat ${rank}e!`;
}
