if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    const weatherIconMap = {
      "01d": "sun",
      "01n": "moon",
      "02d": "sun",
      "02n": "moon",
      "03d": "cloud",
      "03n": "cloud",
      "04d": "cloud",
      "04n": "cloud",
      "09d": "cloud-rain",
      "09n": "cloud-rain",
      "10d": "cloud-rain",
      "10n": "cloud-rain",
      "11d": "cloud-lightning",
      "11n": "cloud-lightning",
      "13d": "cloud-snow",
      "13n": "cloud-snow",
      "50d": "water",
      "50n": "water",
    };

    const locButton = document.querySelector(".loc-button");
    const todayInfo = document.querySelector(".today-info");
    const todayWeatherIcon = document.querySelector(".today-weather i");
    const todayTemp = document.querySelector(".weather-temp");
    const daysList = document.querySelector(".days-list");
    const locationElement = document.querySelector('.today-info > div > span');

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/weather?lat=${latitude}&lon=${longitude}`, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);

        todayInfo.querySelector("h2").textContent = response.today;
        todayInfo.querySelector("span").textContent = response.date;
        todayWeatherIcon.className = `bx bx-${weatherIconMap[response.icon]}`;
        document.getElementById("temperature").textContent = response.temperature + "°C";
        document.getElementById("description").textContent = response.description;
        locationElement.textContent = `${response.city}, ${response.country}`;
       

        // Update todays info in the "day-info" section
        const todayPrecipitation = `${response.clouds}%`;
        const todayHumidity = `${response.humidity}%`;
        const todayWindSpeed = `${response.wind} km/h`;

        const dayInfoContainer = document.querySelector(".day-info");
        dayInfoContainer.innerHTML = `

            <div>
                <span class="title">Precipitaciones</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">Humedad</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">Viento</span>
                <span class="value">${todayWindSpeed}</span>
            </div>

        `;
      }
    };
    xhr.send();
  });
} else {
  console.log("Geolocation is not available");
}
