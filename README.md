<h1>Proyecto Lab de Aplicaciones</h1>

Intall flask

```bash
pip install flask

```

Install Requests

```bash
pip install requests

```

<h1>Funciones fetchWeatherData y fetchLocationData</h1>
Estas funciones utilizan XMLHttpRequest para realizar solicitudes a servidores externos y obtener datos meteorológicos y de ubicación en función de la latitud y longitud proporcionadas.

<h1>Función obtenerRecetasSugeridas</h1>
Esta función se encarga de obtener recetas sugeridas basadas en la región y la temperatura. Utiliza datos almacenados en el almacenamiento local del navegador o, si no existen, consulta un conjunto predefinido de recetas por región y temperatura.

<h1>Función mostrarComidas</h1>
Esta función se encarga de mostrar las recetas sugeridas en la página web. Crea elementos HTML para cada receta y los agrega al contenedor de recetas.

<h1>Otras funciones</h1>
<h3>updateWeatherInfo:</h3> Actualiza la información meteorológica en la página web.
<h3>obtenerFechaActual:</h3> Obtiene la fecha actual en el formato AAAA-MM-DD.
<h3>encontrarRegion:</h3> Determina la región correspondiente a una provincia dada utilizando datos de provincias y regiones predefinidos.

El proyecto en su conjunto se centra en proporcionar una experiencia personalizada al usuario basada en su ubicación y la temperatura local. Ofrece información meteorológica actualizada y sugerencias de recetas de cocina adaptadas a su ubicación geográfica.


