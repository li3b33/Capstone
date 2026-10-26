const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const certificadoRoutes = require('./routes/certificadoRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const actividadRoutes = require('./routes/actividadRoutes');
const noticiaRoutes = require('./routes/noticiaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/reservas', reservaRoutes); 
app.use('/api/actividades', actividadRoutes);
app.use('/api/noticias', noticiaRoutes);


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/noticias', noticiaRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Sistema Unidad Territorial funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});