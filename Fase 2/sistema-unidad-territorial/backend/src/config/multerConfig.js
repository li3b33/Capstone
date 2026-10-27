const multer = require('multer');
const path = require('path');

// Configurar dónde y cómo se guardan los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Guardar en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    // Nombre único para evitar sobreescribir: fecha-nombreOriginal
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, png, etc.)'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;