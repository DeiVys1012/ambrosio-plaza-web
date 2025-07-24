const { pool, query, run, closePool } = require('../config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🚀 Inicializando base de datos PostgreSQL...');

    // Leer el archivo schema.sql (PostgreSQL)
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Ejecutar el esquema línea por línea
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await run(statement);
        } catch (error) {
          // Ignorar errores de tablas que ya existen
          if (!error.message.includes('already exists')) {
            console.warn('⚠️ Advertencia al ejecutar:', statement.substring(0, 50) + '...');
          }
        }
      }
    }
    
    console.log('✅ Esquema de base de datos creado correctamente');

    // Crear administrador por defecto con contraseña real
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);
    
    await run(`
      INSERT INTO admins (nombre, email, password_hash, rol) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password_hash = $3, 
        updated_at = CURRENT_TIMESTAMP
    `, ['Administrador Principal', 'admin@ambrosio-plaza.edu.ve', passwordHash, 'admin']);

    console.log('✅ Administrador por defecto creado:');
    console.log('   Email: admin@ambrosio-plaza.edu.ve');
    console.log('   Contraseña: admin123');

    // Verificar que los datos se insertaron correctamente
    const adminResult = await query('SELECT COUNT(*) as count FROM admins WHERE activo = true');
    const subjectsResult = await query('SELECT COUNT(*) as count FROM subjects WHERE activo = true');
    const inscriptionsResult = await query('SELECT COUNT(*) as count FROM inscription_dates WHERE activo = true');
    const paymentsResult = await query('SELECT COUNT(*) as count FROM payment_dates WHERE activo = true');
    const documentsResult = await query('SELECT COUNT(*) as count FROM documents WHERE activo = true');
    const reportsResult = await query('SELECT COUNT(*) as count FROM financial_reports WHERE activo = true');

    console.log('\n📊 Resumen de datos insertados:');
    console.log(`   Administradores: ${adminResult.rows[0].count}`);
    console.log(`   Materias: ${subjectsResult.rows[0].count}`);
    console.log(`   Fechas de inscripción: ${inscriptionsResult.rows[0].count}`);
    console.log(`   Fechas de pagos: ${paymentsResult.rows[0].count}`);
    console.log(`   Documentos: ${documentsResult.rows[0].count}`);
    console.log(`   Reportes financieros: ${reportsResult.rows[0].count}`);

    console.log('\n🎉 Base de datos inicializada correctamente!');
    console.log('   El sistema está listo para usar.');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase }; 