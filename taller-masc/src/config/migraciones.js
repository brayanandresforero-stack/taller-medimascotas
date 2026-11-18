const pool = require('./db');

// Crea las tablas nuevas si todavía no existen (se ejecuta al iniciar el servidor)
async function migrar() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS solicitudes_empleo (
      id             int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      empleado_id    int(10) UNSIGNED NOT NULL,
      veterinaria_id int(10) UNSIGNED NOT NULL,
      cargo          varchar(100) DEFAULT NULL,
      estado         enum('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
      created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      respondida_at  timestamp NULL DEFAULT NULL,
      PRIMARY KEY (id),
      KEY idx_sol_empleado (empleado_id),
      KEY idx_sol_veterinaria (veterinaria_id),
      CONSTRAINT fk_sol_empleado    FOREIGN KEY (empleado_id)    REFERENCES empleados (id)    ON DELETE CASCADE,
      CONSTRAINT fk_sol_veterinaria FOREIGN KEY (veterinaria_id) REFERENCES veterinarias (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
}

module.exports = { migrar };
