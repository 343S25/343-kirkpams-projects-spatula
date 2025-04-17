
// Replace with form input later 
const city = "Harrisonburg";
const locality = "Virginia";
const tempUnit = "fahrenheit";

// Given user input, we find the temperature for the user's city
let latitude, longitude;
fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`)
    .then(response => response.json())
    .then((data) => {
        // We're using .find() because it stops at the first city that matches the location
        foundCity = data.results.find((city) => city.admin1 == locality)
        // If foundCity != undefined, set the lat and long to the city
        if (foundCity) {
            latitude = foundCity.latitude;
            longitude = foundCity.longitude;
        } else {
        // In case the locality can't be found, search the matching City with highest population
            latitude = data.results[0].latitude;
            longitude = data.results[0].longitude;
        }
        // Now that we have coordinates, let's get the forecast... 
        let weatherURL = (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&forecast_days=1&wind_speed_unit=mph&temperature_unit=${tempUnit}&precipitation_unit=inch`);
        fetch(weatherURL)
            .then(response => response.json())
            .then((data) => {
                temperature = data.current.temperature_2m;
                unit = data.current_units.temperature_2m;
                console.log(`The current temperature in ${city} ${locality} is ${temperature}${unit}`)
            })
            .catch((error) => {
                throw new Error("Error while obtaining temperature data: " + error)
            });
    })
    .catch((error) => {
        throw new Error("Error while obtaining weather information: " + error);
    })
