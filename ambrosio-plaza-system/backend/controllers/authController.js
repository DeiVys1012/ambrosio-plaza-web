const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

class AuthController {
  // Login de administrador
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validar campos requeridos
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      // Verificar credenciales
      const admin = await Admin.verifyCredentials(email, password);
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          id: admin.id, 
          email: admin.email, 
          rol: admin.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Enviar respuesta exitosa
      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          admin: {
            id: admin.id,
            nombre: admin.nombre,
            email: admin.email,
            rol: admin.rol
          },
          token
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Verificar token
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Obtener información del administrador
      const admin = await Admin.getById(decoded.id);
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
      }

      res.json({
        success: true,
        message: 'Token válido',
        data: {
          admin: {
            id: admin.id,
            nombre: admin.nombre,
            email: admin.email,
            rol: admin.rol
          }
        }
      });

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

      console.error('Error al verificar token:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Cambiar contraseña
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const adminId = req.user.id; // Viene del middleware de autenticación

      // Validar campos requeridos
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual y nueva contraseña son requeridas'
        });
      }

      // Validar longitud de la nueva contraseña
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      // Cambiar contraseña
      await Admin.changePassword(adminId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Contraseña actualizada correctamente'
      });

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error.message.includes('incorrecta')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Recuperar contraseña (simulado)
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email es requerido'
        });
      }

      // Verificar si el email existe
      const admin = await Admin.getByEmail(email);
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró un administrador con ese email'
        });
      }

      // En un entorno real, aquí se enviaría un email con instrucciones
      // Por ahora, solo simulamos el envío
      
      res.json({
        success: true,
        message: `Se han enviado instrucciones de recuperación a ${email}`,
        note: 'En un entorno de producción, se enviaría un email real'
      });

    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener perfil del administrador
  static async getProfile(req, res) {
    try {
      const adminId = req.user.id;
      
      const admin = await Admin.getById(adminId);
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Administrador no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          admin: {
            id: admin.id,
            nombre: admin.nombre,
            email: admin.email,
            rol: admin.rol,
            created_at: admin.created_at
          }
        }
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = AuthController; 