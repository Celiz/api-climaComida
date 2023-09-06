const apiKey = '31e3dfa472160d5972bfc0a67c451fc0';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');

// Mapping of weather condition codes to icon class names (Depending on Openweather Api Response)
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchWeatherDataByCoords(latitude, longitude) {
    // Construir la URL de la API con la latitud, longitud, clave de API y configuración de idioma en español
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`;

    // Obtener datos meteorológicos de la API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const todayWeather = data.list[0].weather[0].description;
            const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
            const todayWeatherIconCode = data.list[0].weather[0].icon;

            const todayDayName = new Date().toLocaleDateString('es', { weekday: 'long' });
            const todayDayNameCapitalized = todayDayName.charAt(0).toUpperCase() + todayDayName.slice(1);

            todayInfo.querySelector('h2').textContent = todayDayNameCapitalized;
            todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
            todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
            todayTemp.textContent = todayTemperature;

            // Actualizar la ubicación y la descripción del clima en la sección "left-info"
            const locationElement = document.querySelector('.today-info > div > span');
            locationElement.textContent = `${data.city.name}, ${data.city.country}`;

            const weatherDescriptionElement = document.querySelector('.today-weather > h3');
            weatherDescriptionElement.textContent = todayWeather;

            // Actualizar la información de hoy en la sección "day-info"
            const todayPrecipitation = `${data.list[0].pop}%`;
            const todayHumidity = `${data.list[0].main.humidity}%`;
            const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

            const dayInfoContainer = document.querySelector('.day-info');
            dayInfoContainer.innerHTML = `
                <div>
                    <span class="title">PRECIPITACIÓN</span>
                    <span class="value">${todayPrecipitation}</span>
                </div>
                <div>
                    <span class="title">HUMEDAD</span>
                    <span class="value">${todayHumidity}</span>
                </div>
                <div>
                    <span class="title">VIENTO</span>
                    <span class="value">${todayWindSpeed}</span>
                </div>
            `;

            // Actualizar el clima de los próximos 4 días
            const today = new Date();
            const nextDaysData = data.list.slice(1);

            const uniqueDays = new Set();
            let count = 0;
            daysList.innerHTML = '';
            for (const dayData of nextDaysData) {
                const forecastDate = new Date(dayData.dt_txt);
                const dayAbbreviation = forecastDate.toLocaleDateString('es', { weekday: 'short' });
                const dayTemp = `${Math.round(dayData.main.temp)}°C`;
                const iconCode = dayData.weather[0].icon;

                // Asegurarse de que el día no sea duplicado y no sea hoy
                if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                    uniqueDays.add(dayAbbreviation);
                    daysList.innerHTML += `
                        <li>
                            <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                            <span>${dayAbbreviation}</span>
                            <span class="day-temp">${dayTemp}</span>
                        </li>
                    `;
                    count++;
                }

                // Detener después de obtener 4 días distintos
                if (count === 4) break;
            }
        })
        .catch(error => {
            alert(`Error al obtener datos meteorológicos: ${error} (Error de API)`);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        // Use Geolocation API to get the user's coordinates
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Call the function to fetch weather data using coordinates
            fetchWeatherDataByCoords(latitude, longitude);
        }, error => {
            alert(`Error getting location: ${error.message}`);
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

