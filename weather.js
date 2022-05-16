const OPENWEATHER_API_KEY = "6659227eef739663c8ddbcb8fc1a472b";
const OPENWEATHER_LAT = 52.3545828;
const OPENWEATHER_LONG = 4.763878;

async function getWeatherDescription() {
    let res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${OPENWEATHER_LAT}&lon=${OPENWEATHER_LONG}&appid=${OPENWEATHER_API_KEY}`
    );

    if (res.ok) {
        let data = await res.json();
        return `${data.weather[0].description}\n${data.main.temp.toFixed(1)}°C`;
    } else {
        return "";
    }
}
