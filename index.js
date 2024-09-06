// importacion de modulos
const express = require('express');
const path = require('path');
const indexRutas = require('./rutas/indexRutas');
const busquedasRutas = require('./rutas/busquedasRutas');
const objetoRutas = require('./rutas/objetoRutas');

//configuracion del servidor
const app = express();
const PORT = 3000;

//configuracion de motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//configuracion de directorio publico
app.use(express.static(path.join(__dirname, 'public')));

//configuracion de rutas
app.use('/', indexRutas);
app.use('/', busquedasRutas);
app.use('/', objetoRutas);

//inicializacion del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

/* INDEX.JS --> configura un servidor web utilizando Express.js, un framework de Node.js para aplicaciones web.
 El servidor escucha en el puerto 3000 y sirve contenido estático, 
 renderiza plantillas EJS, y rutas específicas para manejar diferentes solicitudes.*/ 