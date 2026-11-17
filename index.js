const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Medimascotas');
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});

