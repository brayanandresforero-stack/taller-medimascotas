require('dotenv').config();
const app = require('./src/app');
const { migrar } = require('./src/config/migraciones');

const PORT = process.env.PORT || 3000;

migrar()
  .then(() => console.log('✅ Tablas al día'))
  .catch((e) => console.error('❌ Error creando tablas:', e.message))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en puerto ${PORT}`);
    });
  });
