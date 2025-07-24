const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el administrador existe y está activo
    const admin = await Admin.getById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - Usuario no encontrado'
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      id: admin.id,
      email: admin.email,
      rol: admin.rol
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida'
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado - Permisos insuficientes'
      });
    }

    next();
  };
};

// Middleware para verificar si es administrador
const requireAdmin = requireRole(['admin']);

// Middleware para verificar si es super admin
const requireSuperAdmin = requireRole(['super_admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireSuperAdmin
}; 