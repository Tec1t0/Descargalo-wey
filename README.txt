Descargar todos los archivos y dejar todos dentro de la misma carpeta.

Ejemplo: crear carpeta (Método de Bisección) dentro de esta carpeta agregar los archivos obtenidos anteriormente (script.js, style.css, libs, index.html).

Es importante mantener todos los archivos que están en la carpeta de libs, dejándolos en esa carpeta.
Además, recalcar no cambiar ningún nombre a ninguno de los archivos ya que la página web no funcionará.
Si se llegase a cambiar algún nombre, se debería de indicar en el código de programación realizado en el index.html.

Si se cambia el nombre del "style.css" buscar en el HTML la siguiente línea de código:

HTML

<link rel="stylesheet" href="styles.css">

Por ejemplo, si se le cambia el nombre al "style.css" a "stilo.css" se deberá cambiar en el href:

HTML
<link rel="stylesheet" href="stilo.css">
(Ojo con las mayúsculas, minúsculas y tildes).

Si se cambia el nombre de la carpeta "libs" buscar en el HTML las siguientes líneas de código:

HTML

<script src="libs/math.min.js"></script>
<script src="libs/chart.umd.min.js"></script>
<script src="libs/p5.min.js"></script>

Por ejemplo, si se le cambia el nombre a la carpeta "libs" a "libreria" se deberá cambiar así:

HTML

<script src="libreria/math.min.js"></script>
<script src="libreria/chart.umd.min.js"></script>
<script src="libreria/p5.min.js"></script>
(Ojo con las mayúsculas, minúsculas y tildes).

Si se cambia el nombre del "script.js" buscar en el HTML la siguiente línea de código:

HTML
<script src="script.js"></script>

Por ejemplo, si se le cambia el nombre al "script.js" a "log.js" se deberá cambiar así:

HTML
<script src="log.js"></script>
(Ojo con las mayúsculas, minúsculas y tildes).

Los nombres de los archivos de JavaScript que están dentro de la carpeta de libs manténgalos con ese nombre y no los cambie.

Recomendado descargar Visual Studio Code de microsoft para poder ejecutar la pagina web de manera offline.
 link de descarga: https://code.visualstudio.com




