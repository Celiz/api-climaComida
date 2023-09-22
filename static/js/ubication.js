document.addEventListener("DOMContentLoaded", function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const { latitude, longitude } = position.coords;

      fetchWeatherData(latitude, longitude, function (weatherData) {
        updateWeatherInfo(weatherData);

        fetchLocationData(latitude, longitude, function (locationData) {
          updateLocationInfo(locationData);

          const region = encontrarRegion(locationData.provincia);
          const temperatura = weatherData.temperature;

          const recetasSugeridas = obtenerRecetasSugeridas(region, temperatura);
          mostrarRecetas(recetasSugeridas); // Asegúrate de llamar a la función aquí
        });
      });
    }, function (error) {
      console.error("Error en geolocalización:", error.message);
    });
  } else {
    console.error("El navegador no soporta geolocalización");
  }
});


function obtenerRecetasSugeridas(region, temperatura) {
  const fechaActual = obtenerFechaActual(); 
  const recetasAlmacenadas = localStorage.getItem(`recetas_${fechaActual}`);
  if (recetasAlmacenadas) {
    return JSON.parse(recetasAlmacenadas);
  } else {
    const recetasPorRegion = {
      "Región Norte": [
        { nombre: "Empanadas Salteñas", ingredientes: ["carne molida", "cebolla", "aceitunas", "huevo"], temperaturaIdeal: 25 },
        { nombre: "Humita en Chala", ingredientes: ["choclo", "queso", "cebolla", "manteca"], temperaturaIdeal: 20 },
        // Otras recetas para la Región Norte
      ],
      "Región Centro": [
        { nombre: "Asado Criollo", ingredientes: ["carne asada", "sal", "pimienta"], temperaturaIdeal: 30 },
        { nombre: "Milanesa a la Napolitana", ingredientes: ["filete de carne", "pan rallado", "jamón", "queso", "salsa de tomate"], temperaturaIdeal: 25 },
        { nombre: "Ñoquis", ingredientes: ["papa", "harina", "sal"], temperaturaIdeal: 20 },
        { nombre: "Locro", ingredientes: ["maíz", "carne", "chorizo", "cebolla", "pimiento", "pimentón"], temperaturaIdeal: 15 },
        { nombre: "Tarta de Jamón y Queso", ingredientes: ["masa de tarta", "jamón", "queso", "huevos", "crema"], temperaturaIdeal: 10 },
      ],
      "Región Noreste": [
        { nombre: "Chipá", ingredientes: ["almidón de mandioca", "queso", "huevo"], temperaturaIdeal: 30 },
        { nombre: "Sopa Paraguaya", ingredientes: ["harina de maíz", "cebolla", "queso", "leche"], temperaturaIdeal: 25 },
        // Otras recetas para la Región Noreste
      ],
      "Región Cuyo": [
        { nombre: "Carbonada", ingredientes: ["carne", "papa", "choclo", "cebolla", "tomate"], temperaturaIdeal: 30 },
        { nombre: "Pastelitos", ingredientes: ["masa para pastelitos", "dulce de membrillo"], temperaturaIdeal: 25 },
        // Otras recetas para la Región Cuyo
      ],
      "Región Patagónica": [
        { nombre: "Cordero Patagónico", ingredientes: ["cordero", "papa", "cebolla", "zanahoria"], temperaturaIdeal: 30 },
        { nombre: "Tortas Fritas", ingredientes: ["harina", "levadura", "agua", "sal"], temperaturaIdeal: 25 },
        // Otras recetas para la Región Patagónica
      ],
    };
    

    const recetasRegion = recetasPorRegion[region] || [];

    const recetasSugeridas = recetasRegion.filter((receta) => {
      return temperatura <= receta.temperaturaIdeal;
    });
    if (recetasSugeridas.length >= 2) {
      const recetasAleatorias = [];
      while (recetasAleatorias.length < 2) {
        const indiceAleatorio = Math.floor(Math.random() * recetasSugeridas.length);
        recetasAleatorias.push(recetasSugeridas[indiceAleatorio]);
        recetasSugeridas.splice(indiceAleatorio, 1); // Evita duplicados
      }
    
      localStorage.setItem(`recetas_${fechaActual}`, JSON.stringify(recetasAleatorias));
      return recetasAleatorias;
    } else {
      return recetasSugeridas;
    }
  }
}

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses se indexan desde 0
  const año = fecha.getFullYear();
  return `${año}-${mes < 10 ? "0" : ""}${mes}-${dia < 10 ? "0" : ""}${dia}`;
}

function mostrarRecetas(recetas) {
  const recetasContainer = document.querySelector(".recetas-container");
  recetasContainer.innerHTML = "";

  if (recetas.length === 0) {
    recetasContainer.textContent = "No hay recetas sugeridas para esta temperatura en esta región.";
    return;
  }

  const ul = document.createElement("ul");
  recetas.forEach((receta) => {
    const li = document.createElement("li");
    const nombreReceta = document.createElement("div");
    nombreReceta.textContent = receta.nombre;
    li.appendChild(nombreReceta);

    if (Array.isArray(receta.ingredientes) && receta.ingredientes.length > 0) {
      const ingredientesReceta = document.createElement("div");
      ingredientesReceta.textContent = "Ingredientes:";
      const ulIngredientes = document.createElement("ul");
      receta.ingredientes.forEach((ingrediente) => {
        const liIngrediente = document.createElement("li");
        liIngrediente.textContent = ingrediente;
        ulIngredientes.appendChild(liIngrediente);
      });
      ingredientesReceta.appendChild(ulIngredientes);
      li.appendChild(ingredientesReceta);
    }

    ul.appendChild(li);
  });
  recetasContainer.appendChild(ul);
}



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

function updateLocationInfo(data) {
  const provincia = data.provincia;
  document.querySelector(".region > .provincia").textContent = provincia;
  const regionEncontrada = encontrarRegion(provincia);
  document.querySelector(".region > .region-text").textContent = regionEncontrada;
}

function encontrarRegion(provincia) {
  const datos = {
    "Región Norte": {
      "provincias": ["Salta", "Jujuy", "Tucumán", "Catamarca", "La Rioja", "Santiago del Estero"]
    },
    "Región Noreste": {
      "provincias": ["Formosa", "Chaco", "Corrientes", "Misiones"]
    },
    "Región Centro": {
      "provincias": ["Córdoba", "Santa Fe", "Entre Ríos", "La Pampa", "Buenos Aires", "Ciudad Autónoma de Buenos Aires"]
    },
    "Región Cuyo": {
      "provincias": ["Mendoza", "San Juan", "San Luis"]
    },
    "Región Patagónica": {
      "provincias": ["Neuquén", "Río Negro", "Chubut", "Santa Cruz", "Tierra del Fuego, Antártida e Islas del Atlántico Sur"]
    }
  };
  for (const region in datos) {
    if (datos[region].provincias.includes(provincia)) {
      return region;
    }
  }
  return "No se encontró la región para la provincia proporcionada";
}