// ─── 1. Importaciones y configuración inicial ───
require('dotenv').config();
const dotenv = require('dotenv');
// Cargar las variables de entorno del archivo .env en process.env
dotenv.config();

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');

// ─── 2. Creación de la aplicación ───
const app = express();

// ─── 3. Importación de Rutas ───
const authRoutes      = require('./routes/authRoutes');
const duenomascotaRoutes = require('./routes/duenomascota.routes');
const veterinariosRouter = require('./routes/veterinarios.routes');
const medicamentosRouter = require('./routes/medicamentos.routes');
const empleadosRouter = require('./routes/empleados.routes');
const duenomascotaRouter = require('./routes/duenomascota.routes');
const mascotaRouter = require('./routes/mascota.routes');
const inventarioRouter = require('./routes/inventario.routes');
const veterinariaRouter = require('./routes/veterinaria.routes');

// ─── 4. Middlewares globales y de terceros ───
app.use(cors());
app.use(morgan('dev'));
// Middleware para parsear JSON en el cuerpo de las peticiones (req.body)
app.use(express.json());
app.use(express.static('public'));

// Middlewares de terceros
app.use(require('cors')());           // CORS
app.use(require('morgan')('dev'));   // Logging
app.use(express.json());             // Parsear body JSON

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pasar al siguiente middleware
});

// ─── 5. Asignación de Rutas ───
app.use('/api/auth',      authRoutes);
app.use('/api/duenomascota', duenomascotaRoutes);
app.use('/api/veterinarios', veterinariosRouter);
app.use('/api/medicamentos', medicamentosRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/duenomascota', duenomascotaRouter);
app.use('/api/mascota', mascotaRouter);
app.use('/api/inventario', inventarioRouter);
app.use('/api/veterinaria', veterinariaRouter);

app.use(cors({
  origin: 'http://localhost:5173'
}));

// ─── 6. Middleware de errores global ───
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ─── 7. Inicialización del servidor y exportación ───
app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});

// Exportar la app siempre AL FINAL de la declaración de rutas para su uso en el servidor principal
module.exports = app;
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Medimascotas');
});