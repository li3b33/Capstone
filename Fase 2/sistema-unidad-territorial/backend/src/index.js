const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const certificadoRoutes = require('./routes/certificadoRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/proyectos', proyectoRoutes); 

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Sistema Unidad Territorial funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});