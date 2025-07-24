const { testConnection, query, closePool } = require('../config/db');

async function testDatabase() {
  try {
    console.log('🧪 Probando conexión a PostgreSQL...');
    
    // Probar conexión básica
    await testConnection();
    
    // Probar consultas básicas
    console.log('\n📊 Probando consultas básicas...');
    
    // Contar administradores
    const adminCount = await query('SELECT COUNT(*) as count FROM admins WHERE activo = true');
    console.log(`✅ Administradores: ${adminCount.rows[0].count}`);
    
    // Contar materias
    const subjectCount = await query('SELECT COUNT(*) as count FROM subjects WHERE activo = true');
    console.log(`✅ Materias: ${subjectCount.rows[0].count}`);
    
    // Contar fechas de inscripción
    const inscriptionCount = await query('SELECT COUNT(*) as count FROM inscription_dates WHERE activo = true');
    console.log(`✅ Fechas de inscripción: ${inscriptionCount.rows[0].count}`);
    
    // Probar consulta con parámetros
    console.log('\n🔍 Probando consulta con parámetros...');
    const testAdmin = await query('SELECT nombre, email FROM admins WHERE email = $1', ['admin@ambrosio-plaza.edu.ve']);
    if (testAdmin.rows.length > 0) {
      console.log(`✅ Admin encontrado: ${testAdmin.rows[0].nombre} (${testAdmin.rows[0].email})`);
    } else {
      console.log('⚠️ Admin por defecto no encontrado');
    }
    
    console.log('\n🎉 ¡Todas las pruebas pasaron! PostgreSQL está funcionando correctamente.');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.error('💡 Asegúrate de que:');
    console.error('   1. PostgreSQL esté instalado y corriendo');
    console.error('   2. La base de datos "ambrosio_plaza" exista');
    console.error('   3. Las credenciales en config.env sean correctas');
    console.error('   4. El usuario tenga permisos en la base de datos');
  } finally {
    await closePool();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testDatabase();
}

module.exports = { testDatabase }; 