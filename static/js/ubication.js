document.addEventListener("DOMContentLoaded", function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude, longitude } = position.coords;

        fetchWeatherData(latitude, longitude, function (weatherData) {
          updateWeatherInfo(weatherData);

          fetchLocationData(latitude, longitude, function (locationData) {
            const region = encontrarRegion(locationData.provincia);
            const temperatura = weatherData.temperature;

            const recetasSugeridas = obtenerRecetasSugeridas(
              region,
              temperatura
            );
            console.log(recetasSugeridas);

            mostrarRecetasSugeridas(region, temperatura);
          });
        });
      },
      function (error) {
        console.error("Error en geolocalización:", error.message);
      }
    );
  } else {
    console.error("El navegador no soporta geolocalización");
  }
});

function fetchWeatherData(latitude, longitude, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/weather?lat=${latitude}&lon=${longitude}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const weatherData = JSON.parse(xhr.responseText);
        callback(weatherData);
      } else {
        console.error("Error al obtener datos del clima: " + xhr.status);
      }
    }
  };
  xhr.send();
}

function fetchLocationData(latitude, longitude, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/provincia?lat=${latitude}&lon=${longitude}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const locationData = JSON.parse(xhr.responseText);
        callback(locationData);
      } else {
        console.error("Error al obtener datos de ubicación: " + xhr.status);
      }
    }
  };
  xhr.send();
}

async function obtenerRecetasSugeridas(region, temperatura) {
  const fechaActual = obtenerFechaActual();
  const recetaAlmacenada = localStorage.getItem(`receta_${fechaActual}`);

  if (recetaAlmacenada) {
    return JSON.parse(recetaAlmacenada);
  }

  const response = await fetch("../static/js/recetas.json");
  const recetasPorRegion = await response.json();

  if (!recetasPorRegion[region]) {
    console.error(`No se encontraron recetas para la región ${region}`);
    return [];
  }

  const recetasRegion = recetasPorRegion[region];
  const recetasSugeridas = recetasRegion.filter((receta) => {
    return temperatura <= receta.temperaturaIdeal;
  });

  if (recetasSugeridas.length >= 2) {
    const recetasAleatorias = [];
    while (recetasAleatorias.length < 2) {
      const recetaAleatoria =
        recetasSugeridas[Math.floor(Math.random() * recetasSugeridas.length)];
      if (!recetasAleatorias.includes(recetaAleatoria)) {
        recetasAleatorias.push(recetaAleatoria);
      }
    }
    localStorage.setItem(
      `receta_${fechaActual}`,
      JSON.stringify(recetasAleatorias)
    );
    return recetasAleatorias;
  } else {
    return [];
  }
}

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const año = fecha.getFullYear();
  return `${año}-${mes < 10 ? "0" : ""}${mes}-${dia < 10 ? "0" : ""}${dia}`;
}

async function mostrarRecetasSugeridas(region, temperatura) {
  const recetasSugeridas = await obtenerRecetasSugeridas(region, temperatura);
  mostrarComidas(recetasSugeridas);
}

function mostrarComidas(recetas) {
  const recetasContainer = document.querySelector(".recetas-container");
  recetasContainer.innerHTML = "";

  for (let i = 0; i < 2 && i < recetas.length; i++) {
    const receta = recetas[i];

    const recetaCard = document.createElement("div");
    recetaCard.className = "receta-card";

    const tituloReceta = document.createElement("h3");
    tituloReceta.className = "title-card";
    tituloReceta.textContent = receta.nombre;
    recetaCard.appendChild(tituloReceta);

    const preparacionReceta = document.createElement("p");
    preparacionReceta.className = "preparacion-card";
    preparacionReceta.textContent = "Preparación: " + receta.preparacion;
    recetaCard.appendChild(preparacionReceta);

    const ingredientesReceta = document.createElement("ul");
    ingredientesReceta.className = "ingredientes-card";
    receta.ingredientes.forEach((ingrediente) => {
      const li = document.createElement("li");
      li.textContent = ingrediente;
      ingredientesReceta.appendChild(li);
    });
    recetaCard.appendChild(ingredientesReceta);

    recetasContainer.appendChild(recetaCard);
  }
}

function updateWeatherInfo(data) {
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
  const locationElement = document.querySelector(".today-info > div > span");

  todayInfo.querySelector("h2").textContent = data.today;
  todayInfo.querySelector("span").textContent = data.date;
  todayWeatherIcon.className = `bx bx-${weatherIconMap[data.icon]}`;
  document.getElementById("temperature").textContent = `${data.temperature}°C`;
  document.getElementById("description").textContent = data.description;
  locationElement.textContent = `${data.city}, ${data.country}`;

  const todayPrecipitation = `${data.pop * 100}%`;
  const todayHumidity = `${data.humidity}%`;
  const todayWindSpeed = `${data.wind} km/h`;

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
  for (const day of data.nextDaysData) {
    const { day: dayName, max: dayTemp, icon: dayIcon } = day;
    if (!uniqueDays.has(dayName)) {
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
}

async function encontrarRegion(provincia) {
  const response = await fetch("../static/js/provincias.json");
  const provinciasPorRegion = await response.json();

  for (const region in provinciasPorRegion) {
    if (provinciasPorRegion.hasOwnProperty(region)) {
      const provincias = provinciasPorRegion[region].provincias;
      if (provincias.includes(provincia)) {
        return region;
      }
    }
  }
  console.error(`No se encontró la región para la provincia ${provincia}`);
  return null;
}
