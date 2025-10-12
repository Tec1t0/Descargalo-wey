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


Al tener todos los archivos descargados solamente bastara con acceder a la carpeta donde estan los archivos y abrir el index.html.

y listo a disfutar de la calculadora de metetodo de biseccion.


Visual Studio Code:

Si se quiere abrir la pagina web en Visual Studio Code de microsoft se debera descargar en el siguiente link:
 link de descarga: https://code.visualstudio.com

En Visual Studio Code se recomienda descargar las siguientes extensiones:
-HTML css support
-Code runner
-Live Preview
-Live server

Luego finalmente apretar arriba a la izquierda en la ventana de "file" y open folder o apretar la combinacion de "ctrl+k+ctrl+o"

Seleccionar la carpeta donde estan todos los archivos anteriormente descargados.

Finalmente seleccionar el archivo index.html y direccionarse al costado derecho y hacer click al simbolo que parece un triptico con lupa.


