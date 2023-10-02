document.addEventListener("DOMContentLoaded", function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const { latitude, longitude } = position.coords;

      fetchWeatherData(latitude, longitude, function (weatherData) {
        updateWeatherInfo(weatherData);

        fetchLocationData(latitude, longitude, function (locationData) {
          const region = encontrarRegion(locationData.provincia);
          const temperatura = weatherData.temperature;

          const recetasSugeridas = obtenerRecetasSugeridas(region, temperatura);
          mostrarComidas(recetasSugeridas); 
        });
      });
    }, function (error) {
      console.error("Error en geolocalización:", error.message);
    });
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

function obtenerRecetasSugeridas(region, temperatura) {
  const fechaActual = obtenerFechaActual(); 
  const recetasAlmacenadas = localStorage.getItem(`recetas_${fechaActual}`);
  if (recetasAlmacenadas) {
    return JSON.parse(recetasAlmacenadas);
  } else {

    const recetasPorRegion = {
      "Región Norte": [
        { nombre: "Empanadas Salteñas",ingredientes: ["carne molida", "cebolla", "aceitunas", "huevo"], temperaturaIdeal: 25 },
        { nombre: "Humita en Chala", ingredientes: ["choclo", "queso", "cebolla", "manteca"], temperaturaIdeal: 20 },
      ],
      "Región Centro": [
              { nombre: "Asado Criollo", ingredientes: ["carne asada", "sal", "pimienta"], temperaturaIdeal: 30, pasos: "Paso 1: Preparar la carne asada\nPaso 2: Agregar sal y pimienta\nPaso 3: Cocinar a la parrilla" },
              { nombre: "Milanesa a la Napolitana", ingredientes: ["filete de carne", "pan rallado", "jamón", "queso", "salsa de tomate"], temperaturaIdeal: 25, pasos: "Paso 1: Preparar el filete de carne\nPaso 2: Empanizar con pan rallado\nPaso 3: Agregar jamón y queso\nPaso 4: Hornear con salsa de tomate" },
              { nombre: "Ñoquis", ingredientes: ["papa", "harina", "sal"], temperaturaIdeal: 20, pasos: "Paso 1: Preparar la masa con papa, harina y sal\nPaso 2: Formar los ñoquis\nPaso 3: Cocinar en agua hirviendo" },
              { nombre: "Locro", ingredientes: ["maíz", "carne", "chorizo", "cebolla", "pimiento", "pimentón"], temperaturaIdeal: 15, pasos: "Paso 1: Cocinar maíz y carne\nPaso 2: Agregar chorizo, cebolla y pimiento\nPaso 3: Condimentar con pimentón" },
              { nombre: "Tarta de Jamón y Queso", ingredientes: ["masa de tarta", "jamón", "queso", "huevos", "crema"], temperaturaIdeal: 10, pasos: "Paso 1: Forrar un molde con la masa de tarta\nPaso 2: Rellenar con jamón y queso\nPaso 3: Mezclar huevos y crema, verter sobre la tarta\nPaso 4: Hornear" },
              { nombre: "Plato de pastas calientes", ingredientes: ["pasta", "salsa"], temperaturaIdeal: 10, pasos: "Paso 1: Cocinar la pasta\nPaso 2: Preparar la salsa\nPaso 3: Servir caliente" },
              { nombre: "Polenta", ingredientes: ["harina de maíz", "agua", "sal"], temperaturaIdeal: 10, pasos: "Paso 1: Cocinar la harina de maíz con agua y sal\nPaso 2: Enfriar y cortar en porciones\nPaso 3: Calentar antes de servir" },
              { nombre: "Sopa o Guiso", ingredientes: ["caldo", "verduras", "carne"], temperaturaIdeal: 10, pasos: "Paso 1: Preparar el caldo\nPaso 2: Agregar verduras y carne\nPaso 3: Cocinar hasta que esté listo" },
              { nombre: "Puchero", ingredientes: ["carne", "verduras", "legumbres"], temperaturaIdeal: 10, pasos: "Paso 1: Cocinar carne, verduras y legumbres juntas\nPaso 2: Servir caliente" },
              { nombre: "Salchichas con arroz", ingredientes: ["salchichas", "arroz"], temperaturaIdeal: 15, pasos: "Paso 1: Cocinar las salchichas\nPaso 2: Preparar el arroz\nPaso 3: Servir juntos" },
              { nombre: "Milanesas o Hamburguesas", ingredientes: ["carne", "pan", "condimentos"], temperaturaIdeal: 15, pasos: "Paso 1: Preparar las milanesas o hamburguesas\nPaso 2: Cocinar en una sartén o parrilla\nPaso 3: Servir en pan con condimentos" },
              { nombre: "Pizza", ingredientes: ["masa", "salsa de tomate", "queso", "toppings"], temperaturaIdeal: 15, pasos: "Paso 1: Estirar la masa\nPaso 2: Agregar salsa, queso y toppings\nPaso 3: Hornear hasta que esté dorada" },
              { nombre: "Tarta de JyQ", ingredientes: ["masa de tarta", "jamón", "queso", "huevos", "crema"], temperaturaIdeal: 15, pasos: "Paso 1: Forrar un molde con la masa de tarta\nPaso 2: Rellenar con jamón y queso\nPaso 3: Mezclar huevos y crema, verter sobre la tarta\nPaso 4: Hornear" },
              { nombre: "Churrasco con ensalada", ingredientes: ["churrasco", "ensalada"], temperaturaIdeal: 20, pasos: "Paso 1: Cocinar el churrasco\nPaso 2: Preparar la ensalada\nPaso 3: Servir juntos" },
              { nombre: "Omelette", ingredientes: ["huevos", "relleno"], temperaturaIdeal: 20, pasos: "Paso 1: Batir los huevos\nPaso 2: Cocinar en una sartén con el relleno\nPaso 3: Doble la omelette y sirva" },
              { nombre: "Empanadas", ingredientes: ["masa", "relleno"], temperaturaIdeal: 20, pasos: "Paso 1: Rellenar la masa con el relleno\nPaso 2: Cerrar y sellar las empanadas\nPaso 3: Hornear hasta que estén doradas" },
              { nombre: "Pollo frito", ingredientes: ["pollo", "harina", "condimentos"], temperaturaIdeal: 20, pasos: "Paso 1: Rebozar el pollo en harina y condimentos\nPaso 2: Freír hasta que esté dorado y cocido" },
              { nombre: "Ensalada César", ingredientes: ["lechuga", "pollo", "croutons", "salsa"], temperaturaIdeal: 25, pasos: "Paso 1: Preparar la lechuga, pollo y croutons\nPaso 2: Mezclar con salsa y servir" },
              { nombre: "Tacos", ingredientes: ["tortillas", "carne", "salsas", "verduras"], temperaturaIdeal: 25, pasos: "Paso 1: Preparar la carne y las tortillas\nPaso 2: Agregar salsas y verduras\nPaso 3: Armar los tacos y servir" },
              { nombre: "Papas Fritas", ingredientes: ["papas", "aceite", "sal"], temperaturaIdeal: 25, pasos: "Paso 1: Cortar las papas en tiras\nPaso 2: Freír en aceite caliente\nPaso 3: Espolvorear con sal y servir" },
              { nombre: "Tomates rellenos", ingredientes: ["tomates", "relleno"], temperaturaIdeal: 25, pasos: "Paso 1: Vaciar los tomates y rellenar\nPaso 2: Hornear hasta que estén cocidos" },
              { nombre: "Sanguches de fiambre", ingredientes: ["fiambre", "pan", "condimentos"], temperaturaIdeal: 30, pasos: "Paso 1: Armar el sánguche con fiambre, pan y condimentos\nPaso 2: Servir" },
              { nombre: "Sushi", ingredientes: ["arroz", "pescado", "alga", "salsa de soja"], temperaturaIdeal: 30, pasos: "Paso 1: Preparar el arroz y los ingredientes\nPaso 2: Armar los rollos de sushi\nPaso 3: Servir con salsa de soja" },
              { nombre: "Asado", ingredientes: ["carne asada", "sal", "pimienta"], temperaturaIdeal: 30, pasos: "Paso 1: Preparar la carne asada\nPaso 2: Agregar sal y pimienta\nPaso 3: Cocinar a la parrilla" },
              { nombre: "Picada", ingredientes: ["fiambres", "quesos", "pan", "salsas"], temperaturaIdeal: 30, pasos: "Paso 1: Preparar una selección de fiambres y quesos\nPaso 2: Servir con pan y salsas" }
      ],
      "Región Noreste": [
        { nombre: "Chipá", ingredientes: ["almidón de mandioca", "queso", "huevo"], temperaturaIdeal: 30 },
        { nombre: "Sopa Paraguaya", ingredientes: ["harina de maíz", "cebolla", "queso", "leche"], temperaturaIdeal: 25 },
      
      ],
      "Región Cuyo": [
        { nombre: "Carbonada", ingredientes: ["carne", "papa", "choclo", "cebolla", "tomate"], temperaturaIdeal: 30 },
        { nombre: "Pastelitos", ingredientes: ["masa para pastelitos", "dulce de membrillo"], temperaturaIdeal: 25 },
      
      ],
      "Región Patagónica": [
        { nombre: "Cordero Patagónico", ingredientes: ["cordero", "papa", "cebolla", "zanahoria"], temperaturaIdeal: 30 },
        { nombre: "Tortas Fritas", ingredientes: ["harina", "levadura", "agua", "sal"], temperaturaIdeal: 25 },
        
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
  const mes = fecha.getMonth() + 1; 
  const año = fecha.getFullYear();
  return `${año}-${mes < 10 ? "0" : ""}${mes}-${dia < 10 ? "0" : ""}${dia}`;
}

function mostrarComidas(recetas) {
  const recetasContainer = document.querySelector(".recetas-container");
  recetasContainer.innerHTML = "";
  for (let i = 0; i < 2 && i < recetas.length; i++) {
    const receta = recetas[i];
    const recetaCard = document.createElement("div");
    recetaCard.className = "receta-card";

    if (i === 1) {
      recetaCard.id = "second-card";
    }

    const tituloReceta = document.createElement("h3");
    tituloReceta.className = "title-card";
    tituloReceta.textContent = receta.nombre;
    recetaCard.appendChild(tituloReceta);
    const preparacionReceta = document.createElement("p");
    preparacionReceta.className = "preparacion-card";
    preparacionReceta.textContent = "Preparación: " + receta.pasos; 
    const ingredientesReceta = document.createElement("ul");
    ingredientesReceta.className = "ingredientes-card";
    receta.ingredientes.forEach((ingrediente) => {
      const li = document.createElement("li");
      li.textContent = ingrediente;
      ingredientesReceta.appendChild(li);
    });
    recetasContainer.appendChild(recetaCard);
    recetaCard.appendChild(ingredientesReceta);
    recetaCard.appendChild(preparacionReceta);
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

  const todayPrecipitation =  (`${data.pop}%`);
  const todayHumidity = `${data.humidity}%`;
  const todayWindSpeed = `${data.wind} km/h`;

  const dayInfoContainer = document.querySelector(".day-info");
  dayInfoContainer.innerHTML = `
    <div>
      <span class="title">Precipitaciones</span>
      <span class="value">${(todayPrecipitation)}</span>
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