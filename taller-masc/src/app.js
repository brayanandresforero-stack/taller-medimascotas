require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');


const authRoutes            = require('./routes/authRoutes');
const panelRoutes           = require('./routes/panelRoutes');
const categoriasRoutes      = require('./routes/categorias.routes');
const citasRoutes           = require('./routes/citas.routes');
const consultasRoutes       = require('./routes/consultas.routes');
const empleadosRoutes       = require('./routes/empleados.routes');
const especiesRoutes        = require('./routes/especies.routes');
const formulasRoutes        = require('./routes/formulas.routes');
const inventarioRoutes      = require('./routes/inventario.routes');
const marcasRoutes          = require('./routes/marcas.routes');
const mascotasRoutes        = require('./routes/mascotas.routes');
const pagosRoutes           = require('./routes/pagos.routes');
const pedido_detalleRoutes  = require('./routes/pedido_detalle.routes');
const pedidosRoutes         = require('./routes/pedidos.routes');
const productosRoutes       = require('./routes/productos.routes');
const usuariosRoutes        = require('./routes/usuarios.routes');
const veterinariasRoutes    = require('./routes/veterinarias.routes');
const veterinariosRoutes    = require('./routes/veterinarios.routes');
const misRoutes             = require('./routes/mis.routes');
const trabajoRoutes         = require('./routes/trabajo.routes');

const app = express();




// ─── Middlewares globales ───

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://taller-medimascotas.vercel.app',          // 👈 Vercel producción
    /^https:\/\/taller-medimascotas-.*\.vercel\.app$/, // 👈 Vercel previews
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use(morgan('dev'));



app.use(express.static('public'));




// ─── Rutas ───
app.use('/api/auth',      authRoutes);
app.use('/api/panel',     panelRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/especies', especiesRoutes);
app.use('/api/formulas', formulasRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/pedido_detalle', pedido_detalleRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/veterinarias', veterinariasRoutes);
app.use('/api/veterinarios', veterinariosRoutes);
app.use('/api/mis',     misRoutes);      // usuario: mascotas, citas, historial
app.use('/api/trabajo', trabajoRoutes);  // empleado: su veterinaria y solicitudes

app.get('/', (req, res) => {
  res.send('Bienvenido a la API MediMascotas');
});

// ─── Middleware de errores global ───
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;