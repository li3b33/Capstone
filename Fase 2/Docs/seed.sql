-- =====================================================================
-- Datos de prueba - Sistema Unidad Territorial
-- Ejecutar despues de crear las tablas
-- =====================================================================

-- Limpiar datos existentes (opcional, por si ejecutas varias veces)
TRUNCATE TABLE historial_estado, notificacion_enviada, noticia, aviso,
  inscripcion_actividad, actividad, reserva, espacio,
  proyecto_adjunto, proyecto, solicitud_certificado,
  documento_verificacion, sesion, token_recuperacion,
  directorio_integrante, usuario, junta
RESTART IDENTITY CASCADE;

-- ---------------------------------------------------------------------
-- 1. JUNTA DE VECINOS
-- ---------------------------------------------------------------------
INSERT INTO junta (nombre, unidad_vecinal, comuna, direccion_sede, correo_contacto, logo_url)
VALUES (
  'Junta de Vecinos Villa Los Lagos',
  'UV-042',
  'Puerto Montt',
  'Av. Los Lagos 1234',
  'contacto@jvvillaloslagos.cl',
  'https://ejemplo.cl/logo.png'
);

-- ---------------------------------------------------------------------
-- 2. USUARIOS (1 directorio + 5 vecinos)
-- Password de todos: "password123" (hash bcrypt de ejemplo)
-- ---------------------------------------------------------------------
INSERT INTO usuario (junta_id, rut, nombres, apellidos, fecha_nacimiento, direccion, correo, telefono, password_hash, rol, estado)
VALUES
-- Directorio
(1, '12345678-9', 'María', 'González', '1975-03-15', 'Av. Los Lagos 1234', 'maria.gonzalez@jvvillaloslagos.cl', '+56912345678', '$2b$12$abcdefghijklmnopqrstuv', 'directorio', 'activo'),
(1, '13456789-0', 'Pedro', 'Muñoz', '1968-07-22', 'Av. Los Lagos 1250', 'pedro.munoz@jvvillaloslagos.cl', '+56923456789', '$2b$12$abcdefghijklmnopqrstuv', 'directorio', 'activo'),
(1, '14567890-1', 'Ana', 'Rojas', '1980-11-08', 'Av. Los Lagos 1260', 'ana.rojas@jvvillaloslagos.cl', '+56934567890', '$2b$12$abcdefghijklmnopqrstuv', 'directorio', 'activo'),
-- Vecinos
(1, '15678901-2', 'Juan', 'Pérez', '1990-05-12', 'Calle Los Aromos 456', 'juan.perez@gmail.com', '+56945678901', '$2b$12$abcdefghijklmnopqrstuv', 'vecino', 'activo'),
(1, '16789012-3', 'Carla', 'Silva', '1995-09-30', 'Calle Los Aromos 460', 'carla.silva@gmail.com', '+56956789012', '$2b$12$abcdefghijklmnopqrstuv', 'vecino', 'activo'),
(1, '17890123-4', 'Diego', 'Torres', '2005-01-20', 'Calle Los Aromos 470', 'diego.torres@gmail.com', '+56967890123', '$2b$12$abcdefghijklmnopqrstuv', 'vecino', 'activo'),
(1, '18901234-5', 'Sofía', 'Contreras', '2010-12-05', 'Calle Los Aromos 480', 'sofia.contreras@gmail.com', NULL, '$2b$12$abcdefghijklmnopqrstuv', 'vecino', 'activo'),
(1, '19012345-6', 'Roberto', 'Vargas', '1988-04-18', 'Calle Los Aromos 490', 'roberto.vargas@gmail.com', '+56978901234', '$2b$12$abcdefghijklmnopqrstuv', 'vecino', 'pendiente');

-- ---------------------------------------------------------------------
-- 3. DIRECTORIO (cargos)
-- ---------------------------------------------------------------------
INSERT INTO directorio_integrante (junta_id, usuario_id, cargo, fecha_inicio, fecha_fin)
VALUES
(1, 1, 'presidente', '2024-01-15', NULL),
(1, 2, 'secretario', '2024-01-15', NULL),
(1, 3, 'tesorero', '2024-01-15', NULL);

-- ---------------------------------------------------------------------
-- 4. DOCUMENTOS DE VERIFICACIÓN
-- ---------------------------------------------------------------------
INSERT INTO documento_verificacion (usuario_id, tipo, ruta, estado, revisado_por, fecha_revision)
VALUES
(4, 'cuenta_luz', '/uploads/docs/cuenta_juan.pdf', 'aprobado', 1, '2024-02-01 10:00:00'),
(5, 'contrato_arriendo', '/uploads/docs/contrato_carla.pdf', 'aprobado', 1, '2024-02-02 11:00:00'),
(6, 'cuenta_luz', '/uploads/docs/cuenta_diego.pdf', 'aprobado', 2, '2024-02-03 12:00:00'),
(8, 'cuenta_luz', '/uploads/docs/cuenta_roberto.pdf', 'pendiente', NULL, NULL);

-- ---------------------------------------------------------------------
-- 5. CERTIFICADOS DE RESIDENCIA
-- ---------------------------------------------------------------------
INSERT INTO solicitud_certificado (usuario_id, estado, folio, direccion_certificada, fecha_solicitud, fecha_emision)
VALUES
(4, 'aprobado', 'CERT-2024-0001', 'Calle Los Aromos 456', '2024-02-10 09:00:00', '2024-02-11 10:30:00'),
(5, 'aprobado', 'CERT-2024-0002', 'Calle Los Aromos 460', '2024-02-12 14:00:00', '2024-02-13 09:15:00'),
(6, 'pendiente', NULL, NULL, '2024-02-15 16:00:00', NULL),
(4, 'rechazado', NULL, NULL, '2024-01-05 10:00:00', NULL);

-- ---------------------------------------------------------------------
-- 6. PROYECTOS VECINALES
-- ---------------------------------------------------------------------
INSERT INTO proyecto (usuario_id, titulo, descripcion, presupuesto_estimado, estado, fecha_postulacion)
VALUES
(4, 'Mejoramiento de áreas verdes', 'Plantación de árboles nativos y instalación de riego automático en la plaza principal.', 1500000, 'aprobado', '2024-01-20 10:00:00'),
(5, 'Iluminación LED en cancha', 'Reemplazo de luminarias antiguas por tecnología LED en la cancha de fútbol.', 800000, 'en_revision', '2024-02-05 15:30:00'),
(6, 'Taller de reciclaje', 'Talleres comunitarios para enseñar a reciclar y reutilizar residuos.', 300000, 'recibido', '2024-02-18 11:00:00'),
(4, 'Sede social renovada', 'Reparación del techo y pintura de la sede social.', 2000000, 'rechazado', '2024-01-10 09:00:00');

INSERT INTO proyecto_adjunto (proyecto_id, nombre_archivo, ruta, tipo_mime, tamano_bytes)
VALUES
(1, 'presupuesto_areas_verdes.pdf', '/uploads/proyectos/presupuesto1.pdf', 'application/pdf', 245000),
(1, 'plano_plaza.jpg', '/uploads/proyectos/plano1.jpg', 'image/jpeg', 1200000),
(2, 'cotizacion_led.pdf', '/uploads/proyectos/cotizacion_led.pdf', 'application/pdf', 180000);

-- ---------------------------------------------------------------------
-- 7. ESPACIOS COMUNITARIOS
-- ---------------------------------------------------------------------
INSERT INTO espacio (junta_id, nombre, tipo, descripcion, activo)
VALUES
(1, 'Cancha de fútbol', 'cancha', 'Cancha de pasto sintético con arcos y cierre perimetral.', true),
(1, 'Sala multiuso', 'sala', 'Sala con capacidad para 50 personas, proyector y cocina.', true),
(1, 'Plaza central', 'plaza', 'Plaza con juegos infantiles y áreas verdes.', true),
(1, 'Quincho comunitario', 'otro', 'Quincho con parrilla y mesas para eventos.', true);

-- ---------------------------------------------------------------------
-- 8. RESERVAS
-- ---------------------------------------------------------------------
INSERT INTO reserva (espacio_id, usuario_id, inicio, fin, motivo, estado)
VALUES
(1, 4, '2024-03-01 18:00:00', '2024-03-01 20:00:00', 'Partido de fútbol vecinal', 'aprobada'),
(1, 5, '2024-03-02 10:00:00', '2024-03-02 12:00:00', 'Entrenamiento infantil', 'aprobada'),
(2, 6, '2024-03-05 19:00:00', '2024-03-05 22:00:00', 'Reunión de vecinos', 'pendiente'),
(3, 4, '2024-03-10 15:00:00', '2024-03-10 18:00:00', 'Cumpleaños infantil', 'pendiente');

-- ---------------------------------------------------------------------
-- 9. ACTIVIDADES
-- ---------------------------------------------------------------------
INSERT INTO actividad (junta_id, creado_por, titulo, descripcion, lugar, fecha_hora, cupo_maximo, estado)
VALUES
(1, 1, 'Bingo vecinal', 'Bingo para recaudar fondos para la junta.', 'Sede social', '2024-03-15 19:00:00', 50, 'programada'),
(1, 1, 'Taller de primeros auxilios', 'Taller práctico dictado por bomberos.', 'Sala multiuso', '2024-03-20 18:30:00', 30, 'programada'),
(1, 2, 'Feria de emprendedores', 'Feria con stands de vecinos emprendedores.', 'Plaza central', '2024-04-05 11:00:00', 100, 'programada'),
(1, 3, 'Cine al aire libre', 'Función de cine familiar en la plaza.', 'Plaza central', '2024-02-10 20:00:00', 80, 'realizada');

-- ---------------------------------------------------------------------
-- 10. INSCRIPCIONES A ACTIVIDADES
-- ---------------------------------------------------------------------
INSERT INTO inscripcion_actividad (actividad_id, usuario_id, estado, fecha_inscripcion)
VALUES
(1, 4, 'inscrito', '2024-03-01 10:00:00'),
(1, 5, 'inscrito', '2024-03-01 11:00:00'),
(1, 6, 'inscrito', '2024-03-02 09:00:00'),
(2, 4, 'inscrito', '2024-03-05 14:00:00'),
(2, 5, 'inscrito', '2024-03-05 15:00:00'),
(3, 6, 'inscrito', '2024-03-10 10:00:00'),
(4, 4, 'inscrito', '2024-02-05 18:00:00'),
(4, 5, 'cancelado', '2024-02-06 09:00:00');

-- ---------------------------------------------------------------------
-- 11. AVISOS
-- ---------------------------------------------------------------------
INSERT INTO aviso (junta_id, autor_id, titulo, mensaje, afiche_url, fecha_creacion, fecha_envio_correo)
VALUES
(1, 1, 'Corte de agua programado', 'El día martes 12 de marzo habrá corte de agua de 9:00 a 14:00 hrs por reparación de cañerías.', '/uploads/avisos/corte_agua.pdf', '2024-03-08 10:00:00', '2024-03-08 10:15:00'),
(1, 2, 'Reunión mensual de vecinos', 'Se convoca a todos los vecinos a la reunión mensual el sábado 16 de marzo a las 18:00 hrs en la sede social.', NULL, '2024-03-10 14:00:00', NULL),
(1, 1, 'Inscripción a taller de primeros auxilios', 'Ya están abiertas las inscripciones para el taller de primeros auxilios. Cupos limitados.', '/uploads/avisos/taller.pdf', '2024-03-12 09:00:00', '2024-03-12 09:30:00');

-- ---------------------------------------------------------------------
-- 12. NOTIFICACIONES ENVIADAS
-- ---------------------------------------------------------------------
INSERT INTO notificacion_enviada (aviso_id, usuario_id, canal, estado, fecha_envio, fecha_lectura)
VALUES
(1, 4, 'email', 'leido', '2024-03-08 10:15:00', '2024-03-08 12:30:00'),
(1, 5, 'email', 'leido', '2024-03-08 10:15:00', '2024-03-08 13:00:00'),
(1, 6, 'email', 'enviado', '2024-03-08 10:15:00', NULL),
(1, 4, 'whatsapp', 'leido', '2024-03-08 10:20:00', '2024-03-08 12:35:00'),
(3, 4, 'email', 'enviado', '2024-03-12 09:30:00', NULL),
(3, 5, 'email', 'enviado', '2024-03-12 09:30:00', NULL);

-- ---------------------------------------------------------------------
-- 13. NOTICIAS
-- ---------------------------------------------------------------------
INSERT INTO noticia (junta_id, autor_id, titulo, contenido, imagen_url, fecha_publicacion)
VALUES
(1, 1, 'Nueva directiva 2024-2026', 'En asamblea general se eligió la nueva directiva de la junta de vecinos para el periodo 2024-2026. Felicitaciones a todos los elegidos.', '/uploads/noticias/directiva.jpg', '2024-01-20 18:00:00'),
(1, 2, 'Proyecto de áreas verdes aprobado', 'El proyecto de mejoramiento de áreas verdes fue aprobado por unanimidad. Pronto comenzarán los trabajos.', '/uploads/noticias/areas_verdes.jpg', '2024-02-01 12:00:00'),
(1, 3, 'Taller de reciclaje: inscripciones abiertas', 'Ya están abiertas las inscripciones para el taller de reciclaje. Los cupos son limitados.', NULL, '2024-03-05 10:00:00');

-- ---------------------------------------------------------------------
-- 14. HISTORIAL DE ESTADOS
-- ---------------------------------------------------------------------
INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, motivo, responsable_id, fecha)
VALUES
('usuario', 8, 'pendiente', 'activo', NULL, 1, '2024-02-01 10:00:00'),
('certificado', 1, 'pendiente', 'aprobado', NULL, 1, '2024-02-11 10:30:00'),
('certificado', 2, 'pendiente', 'aprobado', NULL, 1, '2024-02-13 09:15:00'),
('certificado', 4, 'pendiente', 'rechazado', 'El vecino no acreditó residencia en la unidad vecinal.', 2, '2024-01-06 11:00:00'),
('proyecto', 1, 'recibido', 'en_revision', NULL, 1, '2024-01-25 09:00:00'),
('proyecto', 1, 'en_revision', 'aprobado', NULL, 1, '2024-02-01 12:00:00'),
('proyecto', 4, 'recibido', 'en_revision', NULL, 2, '2024-01-15 10:00:00'),
('proyecto', 4, 'en_revision', 'rechazado', 'Presupuesto excede el monto disponible para este año.', 2, '2024-01-20 14:00:00'),
('reserva', 1, 'pendiente', 'aprobada', NULL, 1, '2024-02-28 10:00:00'),
('reserva', 2, 'pendiente', 'aprobada', NULL, 1, '2024-03-01 09:00:00');