// Importación del framework Express para la gestión de servidores y rutas
const express = require('express');
// Importación del paquete dotenv para la lectura de variables de entorno
const dotenv = require('dotenv');

// Cargar las variables de entorno del archivo .env en process.env
dotenv.config();
// Creación e inicialización de la aplicación de Express
const app = express();

// Middleware para parsear JSON en el cuerpo de las peticiones (req.body)
app.use(express.json());

// Rutas
// Importación de los módulos de rutas para los diferentes recursos
const veterinariosRouter = require('./routes/veterinarios.routes');
const medicamentosRouter = require('./routes/medicamentos.routes');
const empleadosRouter = require('./routes/empleados.routes');
const duenomascotaRouter = require('./routes/duenomascota.routes');
const mascotaRouter = require('./routes/mascota.routes');
const inventarioRouter = require('./routes/inventario.routes');
const veterinariaRouter = require('./routes/veterinaria.routes');

// Asignación de prefijos de URL a los enrutadores correspondientes

app.use('/api/veterinarios', veterinariosRouter);
app.use('/api/medicamentos', medicamentosRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/duenomascota', duenomascotaRouter);
app.use('/api/mascota', mascotaRouter);
app.use('/api/inventario', inventarioRouter);
app.use('/api/veterinaria', veterinariaRouter);

// Exportar la app siempre AL FINAL de la declaración de rutas para su uso en el servidor principal
module.exports = app;

app.use(express.json());

app.use(express.static('public'));