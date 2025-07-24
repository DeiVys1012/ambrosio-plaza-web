const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { testConnection } = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const subjectsRoutes = require('./routes/subjectsRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const subjectRoutes = require('./routes/subjectRoutes');
// const inscriptionRoutes = require('./routes/inscriptionRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const documentRoutes = require('./routes/documentRoutes');
// const financeRoutes = require('./routes/financeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/src')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/index.html'));
});

// Ruta de prueba de la API
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ API del Sistema de Gestión Académica Ambrosio Plaza funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta de prueba de la base de datos
app.get('/api/db-test', async (req, res) => {
  try {
    await testConnection();
    res.json({
      message: '✅ Conexión a la base de datos establecida',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: '❌ Error en la conexión a la base de datos',
      error: error.message
    });
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
// app.use('/api/admins', adminRoutes);
// app.use('/api/subjects', subjectRoutes);
// app.use('/api/inscriptions', inscriptionRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/documents', documentRoutes);
// app.use('/api/finance', financeRoutes);

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: '❌ Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    message: '❌ Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend disponible en http://localhost:${PORT}`);
  
  // Probar conexión a la base de datos
  testConnection();
});

module.exports = app;





