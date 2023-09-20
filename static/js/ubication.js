document.addEventListener("DOMContentLoaded", function () {
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
  
        const todayInfo = document.querySelector(".today-info");
        const todayWeatherIcon = document.querySelector(".today-weather i");
        const daysList = document.querySelector(".days-list");
        const locationElement = document.querySelector('.today-info > div > span');
  
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
  
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/weather?lat=${latitude}&lon=${longitude}`, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);

              console.log(response);
  
              todayInfo.querySelector("h2").textContent = response.today;
              todayInfo.querySelector("span").textContent = response.date;
              todayWeatherIcon.className = `bx bx-${weatherIconMap[response.icon]}`;
              document.getElementById("temperature").textContent = response.temperature + "°C";
              document.getElementById("description").textContent = response.description;
              locationElement.textContent = `${response.city}, ${response.country}`;
  
              // Actualizar información en la sección "day-info"
              const todayPrecipitation = `${response.pop * 100}%`;
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

              const uniqueDays = new Set();
              for(let i = 0; i < response.nextDaysData.length; i++) {

                const day = response.nextDaysData[i];
                const dayName = day.day;
                const dayTemp = day.max;
                const dayIcon = day.icon;

                if(!uniqueDays.has(dayName)) {
                  uniqueDays.add(dayName);
                  daysList.innerHTML += `
                  <li>
                    <i class="bx bx-${weatherIconMap[dayIcon]}"></i>
                    <span>${dayName}</span>
                    <span class="day-temp">${dayTemp}°C</span>
                  </li>
                  `;
                }
              }

            } else {
              console.error("Error al obtener datos del clima:", xhr.status);
            }
          }
        };

    xhr.send();
    });
  } else {
    console.error("El navegador no soporta geolocalización");
  }


  navigator.geolocation.getCurrentPosition(function (position) {

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/provincia?lat=${latitude}&lon=${longitude}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
      } else {
        console.error("Error al obtener datos del clima:", xhr.status);
      }
    }
  };  
  xhr.send();
});

});

  