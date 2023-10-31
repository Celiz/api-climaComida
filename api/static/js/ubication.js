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
            mostrarComidas(recetasSugeridas);
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

function obtenerRecetasSugeridas(region, temperatura) {
  const fechaActual = obtenerFechaActual();
  const recetasAlmacenadas = localStorage.getItem(`recetas_${fechaActual}`);
  if (recetasAlmacenadas) {
    return JSON.parse(recetasAlmacenadas);
  } else {
    const recetasPorRegion = {
      "Región Norte": [
        {
          nombre: "Empanadas Salteñas",
          ingredientes: ["carne molida", "cebolla", "aceitunas", "huevo"],
          temperaturaIdeal: 25,
        },
        {
          nombre: "Humita en Chala",
          ingredientes: ["choclo", "queso", "cebolla", "manteca"],
          temperaturaIdeal: 20,
        },
      ],
      "Región Centro": [
        {
          nombre: "Milanesa a la Napolitana",
          ingredientes: [
            "Nalga o cuadrada (según cantidad)",
            "Queso mozzarella (según cantidad)",
            "Jamon cocido (según cantidad)",
            "Una la de puré de tomate",
            "2 dientes de ajo",
            "Aceite",
            "Sal",
            "Pimienta",
          ],
          temperaturaIdeal: 25,
          pasos: `
          PARA LA SALSA.
          Picamos el ajo y la cebolla.
          Calentamos una olla con aceite, ponemos el ajo y la cebolla dentro y esperamos que la cebolla se transparente.
          Después, agregamos el puré de tomate y las dos hojas de laurel, deje cocinar por alrededor de 20 minutos.
          Agregamos sal y pimienta a gusto.

          ARMADO DE MILANESA.
          Vamos colocar primero, por encima de nuestra milanesa, la salsa que acabamos de hacer.
          Luego, colocamos unas fetas de jamón cocido.
          Finalmente, por encima, ponemos nuestro queso.
          Así, las vamos a llevar al horno 180º hasta que se derrita el queso y chorree por los costados generando el efecto más hermoso y tentador del universo.
          Al sacarlas podemos tirar por encima unas pizcas de orégano y ¡listo!
          `,
        },
        {
          nombre: "Ñoquis",
          ingredientes: [
            "1kg de papa",
            "300gr de harina 0000 ",
            "1 huevo",
            "sal",
            "pimienta",
          ],
          temperaturaIdeal: 20,
          pasos: `
          Lavar bien las papas con cáscara para evitar que absorban demasiada agua al hervirlas.
          Hacer un corte horizontal en el contorno de las papas y hervirlas hasta que estén tiernas.
          Pelar las papas mientras aún están calientes y hacer un puré con sal y pimienta.
          Agregar un huevo batido y harina poco a poco para formar una masa.
          Cortar tiras de masa y dar forma a los ñoquis con una herramienta o tenedor enharinado.
          Cocinar los ñoquis en agua hirviendo con sal hasta que floten, luego dejarlos 1 minuto más.
            
            `,
        },

        {
          nombre: "Masa para pizza",
          ingredientes: [
            "1Kg de harina 0000",
            "50gr de levadura",
            "1 cucharada de sal",
            "8 cucharadas de aceite (oliva o girasol)",
            "2 cucharada de azúcar",
            "Agua tibia (a ojo)",
          ],
          temperaturaIdeal: 20,
          pasos: `
          En un bol o taza, colocar la levadura y media taza de agua tibia, agregar una cucharada de azúcar y mezclar hasta que aparezcan burbujas. 
          Cubrir con un nylon y dejar reposar durante aproximadamente 10 minutos.
          En otro bol, poner la harina y mezclarla con la sal, hacer un hueco en el centro y verter la media taza de agua con levadura, incorporar el resto del agua tibia y amasar todos los ingredientes con las manos hasta obtener una masa.
          Agregar el aceite en forma de hilo y continuar amasando.
          Dejar reposar la masa para pizza durante unos 15 minutos y luego amasarla en una superficie enharinada, dividirla en dos partes del mismo tamaño.
          Estirar la masa hasta formar un círculo y colocarla en una fuente para pizza, dejar reposar en un lugar cálido hasta que la masa suba un poco, aproximadamente 15 minutos.
          Precalentar un horno a temperatura alta y hornear la masa durante unos 6 minutos, este paso es crucial para asegurarse de que la masa de pizza quede bien cocida, especialmente en la zona entre los ingredientes y la masa; de lo contrario, esa área quedará húmeda y cruda.
          Agregar una generosa cucharada de salsa de tomate a la masa y hornear durante 2 minutos adicionales.
          `,
        },

        {
          nombre: "Tacos de carne",
          ingredientes: [
            "1kg de carne (peceto, nalga o lo que mas te guste)",
            "4 cebollas morada mediana",
            "3 dientes de ajo",
            "2 morrones rojos",
            "2 morrones verdes",
            "2 tomates mediano",
            "Sal y pimienta",
            "Cilantro",
            "Aceite neutro",
            "Jugo de 1 lima o limon",
          ],
          temperaturaIdeal: 20,
          pasos: `
          Cortar los morrones y la cebolla en juliana, el ajo y el chile bien bien pequeño y el tomate en cubitos, reservar por separado.
          Cortar la carne en tiritas y en un bol salpimentar, agregar la mitad del zumo de lima o limón y dejar macerando unos 20 minutos.
          Si quieren, en este paso pueden hacer la magia que les guste para darle sabor a la carne: ponerle mostaza, un chorro de cerveza… Lo que ustedes quieran, la idea es que los tacos de carne queden bien sabrosos así que todo vale. 
          En una sartén poner un chorro de aceite, el chile seco y el orégano y calentar unos 2 o 3 minutos. Agregar el ajo y el chile y sofreír unos minutos más.
          Agregar la carne y saltear, después de 5 minutos, a mitad de cocción, sumar el tomate y terminar de cocinar.
          Por otro lado, saltear el resto de las verduras hasta que estén cocidas pero OJO: que estén firmes.
          Mezclar las dos preparaciones y rectificamos con sal y pimienta de ser necesario. Le agregamos el resto del zumo de lima o limón y el cilantro deshojado.
          `,
        },
      ],
      "Región Noreste": [
        {
          nombre: "Chipá",
          ingredientes: ["almidón de mandioca", "queso", "huevo"],
          temperaturaIdeal: 30,
        },
        {
          nombre: "Sopa Paraguaya",
          ingredientes: ["harina de maíz", "cebolla", "queso", "leche"],
          temperaturaIdeal: 25,
        },
      ],
      "Región Cuyo": [
        {
          nombre: "Carbonada",
          ingredientes: ["carne", "papa", "choclo", "cebolla", "tomate"],
          temperaturaIdeal: 30,
        },
        {
          nombre: "Pastelitos",
          ingredientes: ["masa para pastelitos", "dulce de membrillo"],
          temperaturaIdeal: 25,
        },
      ],
      "Región Patagónica": [
        {
          nombre: "Cordero Patagónico",
          ingredientes: ["cordero", "papa", "cebolla", "zanahoria"],
          temperaturaIdeal: 30,
        },
        {
          nombre: "Tortas Fritas",
          ingredientes: ["harina", "levadura", "agua", "sal"],
          temperaturaIdeal: 25,
        },
      ],
    };

    const recetasRegion = recetasPorRegion[region] || [];

    const recetasSugeridas = recetasRegion.filter((receta) => {
      return temperatura <= receta.temperaturaIdeal;
    });
    if (recetasSugeridas.length >= 2) {
      const recetasAleatorias = [];
      while (recetasAleatorias.length < 2) {
        const indiceAleatorio = Math.floor(
          Math.random() * recetasSugeridas.length
        );
        recetasAleatorias.push(recetasSugeridas[indiceAleatorio]);
        recetasSugeridas.splice(indiceAleatorio, 1); // Evita duplicados
      }

      localStorage.setItem(
        `recetas_${fechaActual}`,
        JSON.stringify(recetasAleatorias)
      );
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
    preparacionReceta.innerHTML =
      "Preparación: " + "<br><br>" + receta.pasos.replace(/\.\s/g, ".<br>");
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

  const todayPrecipitation = `${data.pop}%`;
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

function encontrarRegion(provincia) {
  const datos = {
    "Región Norte": {
      provincias: [
        "Salta",
        "Jujuy",
        "Tucumán",
        "Catamarca",
        "La Rioja",
        "Santiago del Estero",
      ],
    },
    "Región Noreste": {
      provincias: ["Formosa", "Chaco", "Corrientes", "Misiones"],
    },
    "Región Centro": {
      provincias: [
        "Córdoba",
        "Santa Fe",
        "Entre Ríos",
        "La Pampa",
        "Buenos Aires",
        "Ciudad Autónoma de Buenos Aires",
      ],
    },
    "Región Cuyo": {
      provincias: ["Mendoza", "San Juan", "San Luis"],
    },
    "Región Patagónica": {
      provincias: [
        "Neuquén",
        "Río Negro",
        "Chubut",
        "Santa Cruz",
        "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
      ],
    },
  };
  for (const region in datos) {
    if (datos[region].provincias.includes(provincia)) {
      return region;
    }
  }
  return "No se encontró la región para la provincia proporcionada";
}
