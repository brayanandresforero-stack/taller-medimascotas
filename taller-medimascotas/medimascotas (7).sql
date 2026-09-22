-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-09-2026 a las 16:30:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `medimascotas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `duenomascota`
--

CREATE TABLE `duenomascota` (
  `IdDueno` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Direccion` varchar(50) NOT NULL,
  `Telefono` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `duenomascota`
--

INSERT INTO `duenomascota` (`IdDueno`, `Nombre`, `Apellido`, `Direccion`, `Telefono`) VALUES
(1, 'Carlos', 'Rodríguez', 'Calle 12 #4-15', '3104567890'),
(2, 'María', 'Gómez', 'Carrera 5 #23-89', '3158901234'),
(3, 'Juan', 'Martínez', 'Avenida Principal #10-02', '3001234567'),
(4, 'Ana', 'López', 'Calle 45 #12-34', '3123456789'),
(5, 'Luis', 'Hernández', 'Carrera 8 #15-67', '3187654321'),
(6, 'Laura', 'González', 'Calle 80 #55-11', '3019876543'),
(7, 'Andrés', 'Pérez', 'Avenida Central #3-45', '3206549870'),
(8, 'Sofía', 'Sánchez', 'Carrera 15 #88-20', '3112348765'),
(9, 'Diego', 'Ramírez', 'Calle 100 #14-05', '3165432109'),
(10, 'Valentina', 'Torres', 'Carrera 4 #6-78', '3023456789'),
(11, 'Mateo', 'Díaz', 'Calle 32 #18-90', '3148765432'),
(12, 'Camila', 'Vargas', 'Avenida El Dorado #45-30', '3176549812'),
(13, 'Alejandro', 'Castro', 'Carrera 9 #11-22', '3051239876'),
(14, 'Mariana', 'Morales', 'Calle 67 #23-45', '3139871234'),
(15, 'Daniel', 'Ortiz', 'Carrera 20 #12-50', '3198761234'),
(16, 'Natalia', 'Gutiérrez', 'Calle 5 #8-19', '3045678901'),
(17, 'Santiago', 'Chávez', 'Avenida Sur #78-12', '3214567890'),
(18, 'Daniela', 'Ríos', 'Carrera 12 #34-56', '3109876543'),
(19, 'Gabriel', 'Mendoza', 'Calle 22 #9-81', '3161234567'),
(20, 'Paula', 'Silva', 'Carrera 7 #40-15', '3009871234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `IdEmpleado` int(11) NOT NULL,
  `IDVeterinario` int(11) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `cargo` varchar(50) DEFAULT 'Auxiliar',
  `salario` decimal(10,2) NOT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `IDVeterinaria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`IdEmpleado`, `IDVeterinario`, `nombre`, `apellido`, `documento`, `email`, `telefono`, `cargo`, `salario`, `fecha_ingreso`, `IDVeterinaria`) VALUES
(301, 105, 'Carlos', 'Mendoza', '100100301', 'carlos.mendoza@medimascotas.com', '3101234501', 'Recepcionista', 1400000.00, '2023-01-15', NULL),
(302, 105, 'Ana', 'Gomez', '100100302', 'ana.gomez@medimascotas.com', '3101234502', 'Auxiliar Veterinario', 1600000.00, '2023-02-10', NULL),
(303, 105, 'Luis', 'Hernandez', '100100303', 'luis.hernandez@medimascotas.com', '3101234503', 'Peluquero Canino', 1500000.00, '2023-02-20', NULL),
(304, 105, 'Sofia', 'Rodriguez', '100100304', 'sofia.rodriguez@medimascotas.com', '3101234504', 'Auxiliar de Limpieza', 1300000.00, '2023-03-01', NULL),
(305, NULL, 'Mateo', 'Martinez', '100100305', 'mateo.martinez@medimascotas.com', '3101234505', 'Contador', 2800000.00, '2023-03-15', NULL),
(306, NULL, 'Valentina', 'López', '100100306', 'valentina.lopez@medimascotas.com', '3101234506', 'Recepcionista', 1400000.00, '2023-04-01', NULL),
(307, NULL, 'Diego', 'Garcia', '100100307', 'diego.garcia@medimascotas.com', '3101234507', 'Administrador', 3200000.00, '2023-04-10', NULL),
(308, NULL, 'Camila', 'Pérez', '100100308', 'camila.perez@medimascotas.com', '3101234508', 'Auxiliar Veterinario', 1600000.00, '2023-05-02', NULL),
(309, NULL, 'Javier', 'Sanchez', '100100309', 'javier.sanchez@medimascotas.com', '3101234509', 'Peluquero Canino', 1500000.00, '2023-05-18', NULL),
(310, NULL, 'Daniela', 'Ramirez', '100100310', 'daniela.ramirez@medimascotas.com', '3101234510', 'Secretaria', 1400000.00, '2023-06-01', NULL),
(311, NULL, 'Andres', 'Torres', '100100311', 'andres.torres@medimascotas.com', '3101234511', 'Auxiliar de Farmacia', 1550000.00, '2023-06-15', NULL),
(312, NULL, 'Mariana', 'Diaz', '100100312', 'mariana.diaz@medimascotas.com', '3101234512', 'Auxiliar Veterinario', 1600000.00, '2023-07-01', NULL),
(313, NULL, 'Gabriel', 'Vargas', '100100313', 'gabriel.vargas@medimascotas.com', '3101234513', 'Conductor de Transporte', 1450000.00, '2023-07-20', NULL),
(314, NULL, 'Lucia', 'Castro', '100100314', 'lucia.castro@medimascotas.com', '3101234514', 'Auxiliar de Limpieza', 1300000.00, '2023-08-05', NULL),
(315, NULL, 'Santiago', 'Morales', '100100315', 'santiago.morales@medimascotas.com', '3101234515', 'Encargado de Inventario', 1800000.00, '2023-08-12', NULL),
(316, NULL, 'Isabella', 'Ortiz', '100100316', 'isabella.ortiz@medimascotas.com', '3101234516', 'Recepcionista', 1400000.00, '2023-09-01', NULL),
(317, NULL, 'Sebastian', 'Gutiérrez', '100100317', 'sebastian.gutierrez@medimascotas.com', '3101234517', 'Auxiliar Veterinario', 1600000.00, '2023-09-18', NULL),
(318, NULL, 'Paula', 'Chavez', '100100318', 'paula.chavez@medimascotas.com', '3101234518', 'Peluquera Canina', 1500000.00, '2023-10-02', NULL),
(319, NULL, 'Nicolas', 'Rios', '100100319', 'nicolas.rios@medimascotas.com', '3101234519', 'Asistente Administrativo', 1650000.00, '2023-10-15', NULL),
(320, NULL, 'Fernanda', 'Ruiz', '100100320', 'fernanda.ruiz@medimascotas.com', '3101234520', 'Auxiliar de Quirófano', 1750000.00, '2023-11-01', NULL),
(321, NULL, 'Alejandro', 'Suarez', '100100321', 'alejandro.suarez@medimascotas.com', '3101234521', 'Mantenimiento General', 1350000.00, '2023-11-10', NULL),
(322, NULL, 'Laura', 'Mendoza', '100100322', 'laura.mendoza@medimascotas.com', '3101234522', 'Auxiliar Veterinario', 1600000.00, '2023-12-01', NULL),
(323, NULL, 'Felipe', 'Aguilar', '100100323', 'felipe.aguilar@medimascotas.com', '3101234523', 'Seguridad', 1350000.00, '2023-12-15', NULL),
(324, NULL, 'Natalia', 'Paredes', '100100324', 'natalia.paredes@medimascotas.com', '3101234524', 'Recepcionista', 1400000.00, '2024-01-10', NULL),
(325, NULL, 'Esteban', 'Moreno', '100100325', 'esteban.moreno@medimascotas.com', '3101234525', 'Auxiliar de Laboratorio', 1700000.00, '2024-01-22', NULL),
(326, NULL, 'Victoria', 'Navarro', '100100326', 'victoria.navarro@medimascotas.com', '3101234526', 'Peluquera Canina', 1500000.00, '2024-02-01', NULL),
(327, NULL, 'Hugo', 'Rojas', '100100327', 'hugo.rojas@medimascotas.com', '3101234527', 'Auxiliar Veterinario', 1600000.00, '2024-02-15', NULL),
(328, NULL, 'Elena', 'Molina', '100100328', 'elena.molina@medimascotas.com', '3101234528', 'Auxiliar de Limpieza', 1300000.00, '2024-03-01', NULL),
(329, NULL, 'Samuel', 'Delgado', '100100329', 'samuel.delgado@medimascotas.com', '3101234529', 'Gestor de Compras', 2000000.00, '2024-03-12', NULL),
(330, NULL, 'Gabriela', 'Campos', '100100330', 'gabriela.campos@medimascotas.com', '3101234530', 'Auxiliar Veterinario', 1600000.00, '2024-04-05', NULL),
(331, NULL, 'Julian', 'Vega', '100100331', 'julian.vega@medimascotas.com', '3101234531', 'Peluquero Canino', 1500000.00, '2024-04-20', NULL),
(332, NULL, 'Andrea', 'Serrano', '100100332', 'andrea.serrano@medimascotas.com', '3101234532', 'Recepcionista', 1400000.00, '2024-05-02', NULL),
(333, NULL, 'Tomas', 'Arias', '100100333', 'tomas.arias@medimascotas.com', '3101234533', 'Auxiliar de Farmacia', 1550000.00, '2024-05-18', NULL),
(334, NULL, 'Valeria', 'Figueroa', '100100334', 'valeria.figueroa@medimascotas.com', '3101234534', 'Auxiliar Veterinario', 1600000.00, '2024-06-01', NULL),
(335, NULL, 'Adrian', 'Cárdenas', '100100335', 'adrian.cardenas@medimascotas.com', '3101234535', 'Mantenimiento General', 1350000.00, '2024-06-15', NULL),
(336, NULL, 'Monica', 'Lara', '100100336', 'monica.lara@medimascotas.com', '3101234536', 'Auxiliar de Quirófano', 1750000.00, '2024-07-01', NULL),
(337, NULL, 'David', 'Cordero', '100100337', 'david.cordero@medimascotas.com', '3101234537', 'Conductor de Transporte', 1450000.00, '2024-07-10', NULL),
(338, NULL, 'Clara', 'Soto', '100100338', 'clara.soto@medimascotas.com', '3101234538', 'Auxiliar de Limpieza', 1300000.00, '2024-08-01', NULL),
(339, NULL, 'Rodrigo', 'Pena', '100100339', 'rodrigo.pena@medimascotas.com', '3101234539', 'Auxiliar Veterinario', 1600000.00, '2024-08-15', NULL),
(340, NULL, 'Sonia', 'Guerrero', '100100340', 'sonia.guerrero@medimascotas.com', '3101234540', 'Recepcionista', 1400000.00, '2024-09-01', NULL),
(341, NULL, 'prueba ', 'prueba 111', '123456789', 'prueba_test@gmail.com', '108000 108008', 'Auxiliar', 0.00, NULL, 102),
(342, NULL, 'Ntal', 'Fair', '12354987', '77@gmail.com', '108000 108008', 'Auxiliar', 0.00, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historialclinico`
--

CREATE TABLE `historialclinico` (
  `IdHistorial` int(11) NOT NULL,
  `IdMascota` int(11) NOT NULL,
  `IdVeterinario` int(11) NOT NULL,
  `Fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `MotivoConsulta` varchar(255) NOT NULL,
  `Diagnostico` text NOT NULL,
  `Tratamiento` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `IDInventario` int(11) NOT NULL,
  `IDMedicamentos` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `Precio` decimal(10,2) DEFAULT NULL,
  `IDVeterinaria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`IDInventario`, `IDMedicamentos`, `Cantidad`, `Precio`, `IDVeterinaria`) VALUES
(1, 1, 45, 12500.00, 1),
(2, 2, 30, 28000.00, 1),
(3, 3, 100, 8500.00, 1),
(4, 4, 15, 45000.00, 1),
(5, 5, 60, 18200.00, 1),
(6, 6, 25, 32000.00, 1),
(7, 7, 80, 9500.00, 1),
(8, 8, 12, 65000.00, 1),
(9, 9, 50, 14000.00, 1),
(10, 10, 35, 22500.00, 1),
(11, 11, 90, 7800.00, 1),
(12, 12, 20, 38000.00, 1),
(13, 13, 75, 11000.00, 1),
(14, 14, 18, 52000.00, 1),
(15, 15, 40, 19500.00, 1),
(16, 16, 65, 16000.00, 1),
(17, 17, 10, 85000.00, 1),
(18, 18, 85, 6200.00, 1),
(19, 19, 30, 27500.00, 1),
(20, 20, 55, 13400.00, 1),
(21, 21, 22, 41000.00, 1),
(22, 22, 70, 10500.00, 1),
(23, 23, 14, 58000.00, 1),
(24, 24, 48, 17800.00, 1),
(25, 25, 33, 24000.00, 1),
(26, 26, 95, 8900.00, 1),
(27, 27, 28, 31000.00, 1),
(28, 28, 62, 15200.00, 1),
(29, 29, 16, 49000.00, 1),
(30, 30, 82, 9200.00, 1),
(31, 31, 24, 36500.00, 1),
(32, 32, 53, 12800.00, 1),
(33, 33, 37, 21000.00, 1),
(34, 34, 11, 72000.00, 1),
(35, 35, 78, 10200.00, 1),
(36, 36, 19, 44000.00, 1),
(37, 37, 42, 18900.00, 1),
(38, 38, 68, 14500.00, 1),
(39, 39, 29, 29500.00, 1),
(40, 40, 88, 8100.00, 1),
(41, 41, 13, 61000.00, 1),
(42, 42, 46, 16800.00, 1),
(43, 43, 31, 26000.00, 1),
(44, 44, 73, 11500.00, 1),
(45, 45, 17, 51000.00, 1),
(46, 46, 58, 13900.00, 1),
(47, 47, 26, 33500.00, 1),
(48, 48, 92, 7500.00, 1),
(49, 49, 21, 39000.00, 1),
(50, 50, 64, 15800.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `IdMascota` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Especie` varchar(50) NOT NULL,
  `Raza` varchar(50) NOT NULL,
  `Genero` varchar(20) NOT NULL,
  `IdDueno` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`IdMascota`, `Nombre`, `Especie`, `Raza`, `Genero`, `IdDueno`) VALUES
(1, 'Max', 'Perro', 'Golden Retriever', 'Macho', 1),
(2, 'Luna', 'Gato', 'Siamés', 'Hembra', 2),
(3, 'Kiwi', 'Pájaro', 'Perico Australiano', 'Macho', 3),
(4, 'Mimi', 'Hámster', 'Sirio', 'Hembra', 4),
(5, 'Bandido', 'Hurón', 'Sable', 'Macho', 5),
(6, 'Toby', 'Conejo', 'Belier', 'Macho', 6),
(7, 'Rocky', 'Perro', 'Pastor Alemán', 'Macho', 7),
(8, 'Mia', 'Gato', 'Persa', 'Hembra', 8),
(9, 'Paco', 'Pájaro', 'Canario', 'Macho', 9),
(10, 'Nieve', 'Hámster', 'Ruso', 'Hembra', 10),
(11, 'Choco', 'Hurón', 'Plateado', 'Macho', 11),
(12, 'Tambor', 'Conejo', 'Enano Holandés', 'Macho', 12),
(13, 'Bruno', 'Perro', 'Labrador', 'Macho', 13),
(14, 'Nala', 'Gato', 'Bengala', 'Hembra', 14),
(15, 'Lola', 'Pájaro', 'Ninfa', 'Hembra', 15),
(16, 'Pipo', 'Hámster', 'Roborovski', 'Macho', 16),
(17, 'Sombra', 'Hurón', 'Panda', 'Macho', 17),
(18, 'Pelusa', 'Conejo', 'Cabeza de León', 'Hembra', 18),
(19, 'Thor', 'Perro', 'Bulldog Francés', 'Macho', 19),
(20, 'Kira', 'Gato', 'Maine Coon', 'Hembra', 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos`
--

CREATE TABLE `medicamentos` (
  `IDMedicamentos` int(11) NOT NULL,
  `NombreMedicamento` varchar(50) DEFAULT NULL,
  `TipoMedicamento` varchar(50) DEFAULT NULL,
  `Especie` varchar(50) DEFAULT NULL,
  `Raza` varchar(50) DEFAULT NULL,
  `Genero` varchar(50) DEFAULT NULL,
  `Descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentos`
--

INSERT INTO `medicamentos` (`IDMedicamentos`, `NombreMedicamento`, `TipoMedicamento`, `Especie`, `Raza`, `Genero`, `Descripcion`) VALUES
(1, 'Amoxicilina 250mg', 'Pasta', 'Todas', 'Todas', 'Ambos', 'Antibiótico de amplio espectro para infecciones bacterianas.'),
(2, 'Meloxicam 0.5mg', 'Pasta', 'Perro', 'Razas pequeñas', 'Ambos', 'Antiinflamatorio no esteroideo para dolor articular.'),
(3, 'Meloxicam 2.5mg', 'Pasta', 'Perro', 'Razas grandes', 'Ambos', 'Analgésico y antiinflamatorio para cuadros osteoarticulares.'),
(4, 'Doxiciclina 100mg', 'Pasta', 'Perro', 'Todas', 'Ambos', 'Tratamiento contra erliquia y bacterias intracelulares.'),
(5, 'Ivermectina Gotas', 'Gotas', 'Pájaro', 'Todas', 'Ambos', 'Antiparasitario externo e interno para aves.'),
(6, 'Enrofloxacina 50mg', 'Pasta', 'Gato', 'Todas', 'Ambos', 'Antibiótico bactericida para infecciones urinarias y respiratorias.'),
(7, 'Prednisolona 5mg', 'Pasta', 'Gato', 'Todas', 'Femenino', 'Corticosteroide para procesos alérgicos e inflamatorios.'),
(8, 'Metronidazol Suspensión', 'Jarabe', 'Perro', 'Razas pequeñas', 'Ambos', 'Tratamiento contra giardiasis y diarreas bacterianas.'),
(9, 'Ranitidina Jarabe', 'Jarabe', 'Hámster', 'Todas', 'Ambos', 'Protector gástrico para afecciones estomacales.'),
(10, 'Cefalexina 500mg', 'Pasta', 'Perro', 'Razas medianas', 'Ambos', 'Antibiótico indicado en infecciones dermatológicas.'),
(11, 'Fipronil Spray', 'Spray', 'Conejo', 'Todas', 'Ambos', 'Control de pulgas y ácaros en piel.'),
(12, 'Ketoprofeno 10mg', 'Pasta', 'Hurón', 'Todas', 'Ambos', 'Analgésico para control del dolor posoperatorio.'),
(13, 'Tramadol Gotas', 'Gotas', 'Perro', 'Todas', 'Ambos', 'Analgésico de acción central para dolor severo.'),
(14, 'Shampoo Ketoconazol', 'Tópico', 'Perro', 'Todas', 'Ambos', 'Tratamiento tópico para dermatofitosis y hongos.'),
(15, 'Gotas Oticas Ciprofloxacina', 'Gotas', 'Gato', 'Todas', 'Ambos', 'Tratamiento para otitis externa bacteriana.'),
(16, 'Probiótico Oral', 'Polvo', 'Todas', 'Todas', 'Ambos', 'Restaurador de la flora intestinal tras diarreas.'),
(17, 'Lactulosa Jarabe', 'Jarabe', 'Gato', 'Todas', 'Ambos', 'Laxante y tratamiento para estreñimiento crónico.'),
(18, 'Omeprazol 10mg', 'Pasta', 'Perro', 'Razas pequeñas', 'Ambos', 'Inhibidor de la bomba de protones para gastritis.'),
(19, 'Vitamina B Complejo', 'Jarabe', 'Pájaro', 'Todas', 'Ambos', 'Suplemento vitamínico para estados de debilidad.'),
(20, 'Antiparasitario Febantel', 'Pasta', 'Perro', 'Razas medianas', 'Ambos', 'Desparasitante interno de amplio espectro.'),
(21, 'Milbemicina Oxima', 'Pasta', 'Gato', 'Todas', 'Ambos', 'Prevención de gusano del corazón y parásitos intestinales.'),
(22, 'Cicatrizante Tópico Spray', 'Spray', 'Todas', 'Todas', 'Ambos', 'Antiséptico regenerador para heridas cutáneas.'),
(23, 'Suero Oral Electrólitos', 'Polvo', 'Todas', 'Todas', 'Ambos', 'Rehidratación rápida para casos de deshidratación.'),
(24, 'Antialérgico Clorfeniramina', 'Pasta', 'Perro', 'Razas pequeñas', 'Ambos', 'Antihistamínico para cuadros alérgicos agudos.'),
(25, 'Multivitamínico Calcio', 'Pasta', 'Conejo', 'Todas', 'Ambos', 'Suplemento nutricional para el desarrollo óseo.'),
(26, 'Maropitant 16mg', 'Pasta', 'Perro', 'Razas pequeñas', 'Ambos', 'Antiemético para prevenir vómitos y mareos.'),
(27, 'Maropitant 24mg', 'Pasta', 'Gato', 'Todas', 'Ambos', 'Prevención y control del vómito agudo.'),
(28, 'Florfenicol Solución', 'Inyección', 'Pájaro', 'Todas', 'Ambos', 'Antibiótico para infecciones respiratorias graves.'),
(29, 'Solución Fisiológica Nasal', 'Gotas', 'Hurón', 'Todas', 'Ambos', 'Limpieza de fosas nasales y descongestión.'),
(30, 'Pomada Neomicina', 'Tópico', 'Todas', 'Todas', 'Ambos', 'Crema antibiótica para cortes y raspones.'),
(31, 'Clorhexidina Espuma', 'Tópico', 'Perro', 'Todas', 'Ambos', 'Antiséptico para lavado de pliegues y piel sensibilizada.'),
(32, 'Glicerina Gotas Oticas', 'Gotas', 'Conejo', 'Todas', 'Ambos', 'Limpiador ótico para disolución de cerumen y ácaros.'),
(33, 'Suplemento Omega 3', 'Jarabe', 'Gato', 'Todas', 'Ambos', 'Ácidos grasos para mejorar el pelaje y la piel.'),
(34, 'Dexametasona Inyectable', 'Inyección', 'Perro', 'Razas grandes', 'Ambos', 'Antiinflamatorio potente para emergencias.'),
(35, 'Bismuto Subsalicilato', 'Jarabe', 'Perro', 'Razas medianas', 'Ambos', 'Protector de mucosa digestiva contra la diarrea.'),
(36, 'Antimicótico Griseofulvina', 'Pasta', 'Gato', 'Todas', 'Ambos', 'Tratamiento sistémico contra tiña y dermatófitos.'),
(37, 'Solución Oftálmica Tobramicina', 'Gotas', 'Todas', 'Todas', 'Ambos', 'Gotas oculares para conjuntivitis bacteriana.'),
(38, 'Desparasitante Albendazol', 'Jarabe', 'Hámster', 'Todas', 'Ambos', 'Tratamiento de parásitos gastrointestinales.'),
(39, 'Carprofeno 75mg', 'Pasta', 'Perro', 'Razas grandes', 'Ambos', 'Antiinflamatorio no esteroideo para artrosis.'),
(40, 'Silimarina Gotas', 'Gotas', 'Perro', 'Todas', 'Ambos', 'Hepatoprotector para afecciones del hígado.'),
(41, 'Jarabe Expectorante', 'Jarabe', 'Hurón', 'Todas', 'Ambos', 'Alivio de la tos y facilitador de expulsión de flemas.'),
(42, 'Antiséptico Yodopovidona', 'Tópico', 'Todas', 'Todas', 'Ambos', 'Desinfectante para curaciones y desinfección de piel.'),
(43, 'Fluconazol 50mg', 'Pasta', 'Gato', 'Todas', 'Ambos', 'Tratamiento para micosis sistémicas profundas.'),
(44, 'Suplemento de Hierro', 'Jarabe', 'Pájaro', 'Todas', 'Masculino', 'Reconstituyente para anemias secundarias.'),
(45, 'Gel Oral Clorhexidina', 'Tópico', 'Perro', 'Razas pequeñas', 'Ambos', 'Higiene bucal y control de placa bacteriana.'),
(46, 'Calcio y Vitamina D3', 'Pasta', 'Conejo', 'Todas', 'Ambos', 'Prevención de malformaciones dentales y óseas.'),
(47, 'Clindamicina 150mg', 'Pasta', 'Perro', 'Razas medianas', 'Ambos', 'Antibiótico indicado para infecciones dentales.'),
(48, 'Solución Hidratante Ocular', 'Gotas', 'Todas', 'Todas', 'Ambos', 'Lágrimas artificiales para ojo seco.'),
(49, 'Antiparasitario Selamectina', 'Pipeta', 'Gato', 'Todas', 'Femenino', 'Pipeta para pulgas, ácaros y parásitos internos.'),
(50, 'Tiamina Vitamina B1', 'Inyección', 'Hámster', 'Todas', 'Ambos', 'Sostén neurológico en estados carenciales.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `veterinaria`
--

CREATE TABLE `veterinaria` (
  `IDVeterinaria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `DocumentoLocal` varchar(30) NOT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `veterinaria`
--

INSERT INTO `veterinaria` (`IDVeterinaria`, `nombre`, `DocumentoLocal`, `direccion`, `telefono`, `created_at`) VALUES
(1, 'Veterinaria Central Canina', '900111222-1', 'Calle 10 # 5-20', '3112233445', '2026-09-08 09:13:43'),
(101, 'Centro Médico Animal PetCare', '900222333-2', 'Carrera 15 # 40-12', '3209876543', '2026-09-08 09:13:43'),
(102, 'Clínica Veterinaria El Arca', '900333444-3', 'Avenida Guabinal # 25-10', '3154433221', '2026-09-08 09:13:43'),
(103, 'Hospital Veterinario San Francisco', '900444555-4', 'Calle 60 # 5-45', '3187766554', '2026-09-08 09:13:43'),
(104, 'Veterinaria Huellas y Patas', '900555666-5', 'Carrera 5 # 19-30', '3169988776', '2026-09-08 09:13:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `veterinarios`
--

CREATE TABLE `veterinarios` (
  `IDVeterinario` int(11) NOT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Apellido` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  `Titulo` varchar(100) DEFAULT NULL,
  `Especialidad` varchar(50) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `IDVEterinaria` int(11) DEFAULT NULL,
  `idClinica` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `veterinarios`
--

INSERT INTO `veterinarios` (`IDVeterinario`, `documento`, `Nombre`, `Apellido`, `email`, `telefono`, `FechaNacimiento`, `Titulo`, `Especialidad`, `salario`, `IDVEterinaria`, `idClinica`) VALUES
(1, NULL, 'Ana', 'Pérez', NULL, NULL, '1990-05-20', 'Dra.', 'Cirugía', NULL, NULL, NULL),
(101, NULL, 'Carlos', 'Mendoza', NULL, NULL, '1985-04-12', 'Médico Veterinario Zootecnista', 'Cirugía de Pequeños Animales', NULL, 101, NULL),
(102, NULL, 'Ana María', 'Gómez', NULL, NULL, '1990-08-25', 'Doctora en Medicina Veterinaria', 'Dermatología Veterinaria', NULL, 102, NULL),
(103, NULL, 'Javier', 'Rodríguez', NULL, NULL, '1982-11-03', 'Médico Veterinario', 'Cardiología Veterinaria', NULL, 103, NULL),
(104, NULL, 'Laura', 'Martínez', NULL, NULL, '1988-01-19', 'Médica Veterinaria', 'Medicina Felina', NULL, 104, NULL),
(105, NULL, 'Diego', 'Hernández', NULL, NULL, '1992-06-30', 'Médico Veterinario Zootecnista', 'Animales Exóticos y Silvestres', NULL, NULL, NULL),
(106, NULL, 'Sofia', 'Vargas', NULL, NULL, '1987-09-14', 'Doctora en Medicina Veterinaria', 'Oftalmología Veterinaria', NULL, NULL, NULL),
(107, NULL, 'Andrés', 'Castillo', NULL, NULL, '1994-03-22', 'Médico Veterinario', 'Odontología Veterinaria', NULL, NULL, NULL),
(108, NULL, 'Mariana', 'López', NULL, NULL, '1991-12-08', 'Médica Veterinaria Zootecnista', 'Anestesiología y Analgesia', NULL, NULL, NULL),
(109, NULL, 'Felipe', 'Torres', NULL, NULL, '1983-07-05', 'Médico Veterinario', 'Neurología Veterinaria', NULL, NULL, NULL),
(110, NULL, 'Camila', 'Ríos', NULL, NULL, '1995-10-17', 'Doctora en Medicina Veterinaria', 'Medicina Interna y Diagnóstico', NULL, NULL, NULL),
(111, NULL, 'PRUEBA', 'NUMERO 1', NULL, NULL, '2000-12-25', 'PRUEBA', 'ACTUALIZACION', NULL, NULL, NULL),
(112, NULL, 'Actualizar ', 'Desde celular', NULL, NULL, '2026-09-24', 'Celular ', 'Conexión en celular ', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `duenomascota`
--
ALTER TABLE `duenomascota`
  ADD PRIMARY KEY (`IdDueno`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`IdEmpleado`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_empleados_veterinario` (`IDVeterinario`),
  ADD KEY `fk_empleados_veterinaria` (`IDVeterinaria`);

--
-- Indices de la tabla `historialclinico`
--
ALTER TABLE `historialclinico`
  ADD PRIMARY KEY (`IdHistorial`),
  ADD KEY `fk_historial_mascota` (`IdMascota`),
  ADD KEY `fk_historial_veterinario` (`IdVeterinario`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`IDInventario`),
  ADD KEY `fk_Inventario_Medicamentos` (`IDMedicamentos`),
  ADD KEY `fk_inventario_veterinaria` (`IDVeterinaria`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`IdMascota`),
  ADD KEY `fk_mascota_duenomascota` (`IdDueno`);

--
-- Indices de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`IDMedicamentos`);

--
-- Indices de la tabla `veterinaria`
--
ALTER TABLE `veterinaria`
  ADD PRIMARY KEY (`IDVeterinaria`),
  ADD UNIQUE KEY `DocumentoLocal` (`DocumentoLocal`);

--
-- Indices de la tabla `veterinarios`
--
ALTER TABLE `veterinarios`
  ADD PRIMARY KEY (`IDVeterinario`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_veterinarios_veterinaria` (`IDVEterinaria`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `duenomascota`
--
ALTER TABLE `duenomascota`
  MODIFY `IdDueno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `IdEmpleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=344;

--
-- AUTO_INCREMENT de la tabla `historialclinico`
--
ALTER TABLE `historialclinico`
  MODIFY `IdHistorial` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `IDInventario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `IdMascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `veterinaria`
--
ALTER TABLE `veterinaria`
  MODIFY `IDVeterinaria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `fk_empleados_veterinaria` FOREIGN KEY (`IDVEterinaria`) REFERENCES `veterinaria` (`IDVeterinaria`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_empleados_veterinario` FOREIGN KEY (`IDVeterinario`) REFERENCES `veterinarios` (`IDVeterinario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `historialclinico`
--
ALTER TABLE `historialclinico`
  ADD CONSTRAINT `fk_historial_mascota` FOREIGN KEY (`IdMascota`) REFERENCES `mascota` (`IdMascota`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_historial_veterinario` FOREIGN KEY (`IdVeterinario`) REFERENCES `veterinarios` (`IDVeterinario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `fk_Inventario_Medicamentos` FOREIGN KEY (`IDMedicamentos`) REFERENCES `medicamentos` (`IDMedicamentos`),
  ADD CONSTRAINT `fk_inventario_veterinaria` FOREIGN KEY (`IDVeterinaria`) REFERENCES `veterinaria` (`IDVeterinaria`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `fk_mascota_duenomascota` FOREIGN KEY (`IdDueno`) REFERENCES `duenomascota` (`IdDueno`);

--
-- Filtros para la tabla `veterinarios`
--
ALTER TABLE `veterinarios`
  ADD CONSTRAINT `fk_veterinarios_veterinaria` FOREIGN KEY (`IDVEterinaria`) REFERENCES `veterinaria` (`IDVeterinaria`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
