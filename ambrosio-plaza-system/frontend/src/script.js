const systemData = {
  admins: [
    { id: 1, nombre: 'Administrador Principal', email: 'admin@ambrosio-plaza.edu.ve', password: 'admin123' }
  ],
  subjects: [
    { id: 1, nombre: 'Matemáticas', anio_academico: 2024, descripcion: 'Matemáticas básicas y avanzadas' },
    { id: 2, nombre: 'Lengua y Literatura', anio_academico: 2024, descripcion: 'Comunicación y expresión escrita' },
    { id: 3, nombre: 'Ciencias Naturales', anio_academico: 2024, descripcion: 'Biología, Física y Química' },
    { id: 4, nombre: 'Historia', anio_academico: 2024, descripcion: 'Historia de Venezuela y Universal' },
    { id: 5, nombre: 'Geografía', anio_academico: 2024, descripcion: 'Geografía física y política' }
  ],
  inscriptionDates: [
    { id: 1, fecha_inicio: '2024-08-01', fecha_fin: '2024-08-31', descripcion: 'Inscripciones para el año escolar 2024-2025', anio_academico: 2024 },
    { id: 2, fecha_inicio: '2024-09-01', fecha_fin: '2024-09-15', descripcion: 'Inscripciones extraordinarias', anio_academico: 2024 }
  ],
  paymentDates: [
    { id: 1, fecha: '2024-08-15', descripcion: 'Pago de inscripción', monto: 50.00, tipo_pago: 'Inscripción', anio_academico: 2024 },
    { id: 2, fecha: '2024-09-05', descripcion: 'Pago de matrícula', monto: 100.00, tipo_pago: 'Matrícula', anio_academico: 2024 },
    { id: 3, fecha: '2024-10-01', descripcion: 'Pago mensual', monto: 25.00, tipo_pago: 'Mensualidad', anio_academico: 2024 }
  ],
  documents: [
    { id: 1, nombre: 'Reglamento Interno', descripcion: 'Reglamento interno del plantel', url: '#', tipo_documento: 'Reglamento', fecha_subida: '2024-01-15' },
    { id: 2, nombre: 'Manual de Procedimientos', descripcion: 'Manual de procedimientos administrativos', url: '#', tipo_documento: 'Manual', fecha_subida: '2024-01-20' }
  ],
  financialReports: [
    { id: 1, nombre: 'Reporte Financiero Enero 2024', descripcion: 'Balance financiero del mes de enero', url: '#', tipo_reporte: 'Mensual', fecha_reporte: '2024-01-31', fecha_subida: '2024-02-01' },
    { id: 2, nombre: 'Reporte Financiero Febrero 2024', descripcion: 'Balance financiero del mes de febrero', url: '#', tipo_reporte: 'Mensual', fecha_reporte: '2024-02-29', fecha_subida: '2024-03-01' }
  ]
};

// Variables globales
let currentSection = 'inicio';
let isLoggedIn = false;
let currentAdmin = null;
let sidebarCollapsed = true;

// --- DATOS DE USUARIOS DE EJEMPLO ---
const usuariosData = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@ambrosio.edu.ve', rol: 'Superadmin', estado: 'Activo' },
  { id: 2, nombre: 'María González', email: 'maria@ambrosio.edu.ve', rol: 'Administrador', estado: 'Activo' },
  { id: 3, nombre: 'Pedro López', email: 'pedro@ambrosio.edu.ve', rol: 'Administrador', estado: 'Inactivo' }
];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Sistema de Gestión Académica Ambrosio Plaza iniciado');
  
  initializeSidebar();
  initializeNavigation();
  initializeEventListeners();
  showSection('inicio');
  
  // Verificar si hay datos guardados en localStorage
  loadFromLocalStorage();
  
  // Inicializar animaciones
  initializeAnimations();
  
  // Actualizar estado de autenticación
  updateAuthenticationStatus();

  // Inicializar dark mode según preferencia guardada
  const darkPref = localStorage.getItem('darkMode');
  setDarkMode(darkPref === '1');
  // Listener para el botón
  document.body.addEventListener('click', function(e) {
    if (e.target.closest('.btn-toggle-darkmode')) {
      const isDark = document.body.classList.contains('dark-mode');
      setDarkMode(!isDark);
    }
  });

  // Evento para mostrar sección usuarios
  const navUsuarios = document.querySelector('[data-section="usuarios"]');
  if (navUsuarios) {
    navUsuarios.addEventListener('click', function(e) {
      e.preventDefault();
      showSection('usuarios');
    });
  }
  // Evento para botón agregar usuario
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add-user')) {
      showUserModal('nuevo');
    }
    if (e.target.classList.contains('btn-edit-user')) {
      const id = e.target.dataset.id;
      const user = usuariosData.find(u => u.id == id);
      showUserModal('editar', user);
    }
    if (e.target.classList.contains('btn-password-user')) {
      showAlert('Función de cambio de clave en desarrollo', 'info');
    }
    if (e.target.classList.contains('btn-delete-user')) {
      showAlert('Función de eliminar usuario en desarrollo', 'info');
    }
    if (e.target.classList.contains('btn-activate-user')) {
      showAlert('Función de activar usuario en desarrollo', 'info');
    }
  });

  // Hacer clic en el logo vuelve al inicio
  const headerLogoLink = document.getElementById('headerLogoLink');
  if (headerLogoLink) {
    headerLogoLink.addEventListener('click', function(e) {
      e.preventDefault();
      showSection('inicio');
    });
  }
});

// Inicializar sidebar
function initializeSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  
  if (sidebarToggle && sidebar && mainContent) {
    // Aplicar estado colapsado por defecto
    sidebar.classList.add('collapsed');
    mainContent.classList.add('expanded');
    
    sidebarToggle.addEventListener('click', function(e) {
      e.stopPropagation(); // Evitar que el clic se propague
      sidebarCollapsed = !sidebarCollapsed;
      
      if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('open');
        mainContent.classList.add('expanded');
      } else {
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('open');
        mainContent.classList.remove('expanded');
      }
    });
  }
  
  // Responsive sidebar para móviles
  if (window.innerWidth <= 768) {
    sidebar.classList.add('collapsed');
    sidebar.classList.remove('open');
    mainContent.classList.add('expanded');
  }
  
  // Event listener para cerrar sidebar en móviles al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebarToggle');
      
      if (sidebar && sidebarToggle && 
          !sidebar.contains(e.target) && 
          !sidebarToggle.contains(e.target) &&
          !sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('open');
        document.getElementById('mainContent').classList.add('expanded');
        sidebarCollapsed = true;
      }
    }
  });
  
  // Event listener para cambios de tamaño de ventana
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add('collapsed');
      sidebar.classList.remove('open');
      mainContent.classList.add('expanded');
      sidebarCollapsed = true;
    } else {
      // En desktop, mantener el estado colapsado por defecto
      if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('open');
        mainContent.classList.add('expanded');
      } else {
        sidebar.classList.remove('collapsed');
        sidebar.classList.remove('open');
        mainContent.classList.remove('expanded');
      }
    }
  });
}

// Inicializar navegación
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetSection = this.getAttribute('data-section');
      showSection(targetSection);
      
      // Mantener el sidebar abierto en móviles cuando se navega
      if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        if (sidebar && mainContent) {
          sidebar.classList.remove('collapsed');
          sidebar.classList.add('open');
          mainContent.classList.remove('expanded');
          sidebarCollapsed = false;
        }
      }
    });
  });
  
  // Event listeners para action cards
  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', function() {
      const targetSection = this.getAttribute('data-section');
      showSection(targetSection);
      
      // Mantener el sidebar abierto en móviles cuando se navega
      if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        if (sidebar && mainContent) {
          sidebar.classList.remove('collapsed');
          sidebar.classList.add('open');
          mainContent.classList.remove('expanded');
          sidebarCollapsed = false;
        }
      }
    });
  });
}

// Inicializar event listeners
function initializeEventListeners() {
  // Event listeners para botones de acción
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add')) {
      if (!isLoggedIn) {
        showAlert('Debes iniciar sesión como administrador para realizar esta acción', 'warning');
        return;
      }
      showAddModal(e.target.dataset.type);
    } else if (e.target.classList.contains('btn-edit')) {
      if (!isLoggedIn) {
        showAlert('Debes iniciar sesión como administrador para realizar esta acción', 'warning');
        return;
      }
      showEditModal(e.target.dataset.type, e.target.dataset.id);
    } else if (e.target.classList.contains('btn-delete')) {
      if (!isLoggedIn) {
        showAlert('Debes iniciar sesión como administrador para realizar esta acción', 'warning');
        return;
      }
      deleteItem(e.target.dataset.type, e.target.dataset.id);
    } else if (e.target.classList.contains('btn-login')) {
      e.preventDefault();
      showSection('admin');
      // Mantener el sidebar abierto cuando se navega al login
      keepSidebarOpen();
      // Actualizar navegación activa
      updateActiveNavigation('admin');
    } else if (e.target.classList.contains('btn-logout')) {
      logout();
    } else if (e.target.classList.contains('forgot-password-link')) {
      e.preventDefault();
      showForgotPasswordModal();
    } else if (e.target.classList.contains('alert-link')) {
      e.preventDefault();
      showSection('admin');
      // Mantener el sidebar abierto cuando se navega al login desde alertas
      keepSidebarOpen();
      // Actualizar navegación activa
      updateActiveNavigation('admin');
    }
  });
  
  // Cerrar modales
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
      closeModal();
    }
  });
}

// Inicializar animaciones
function initializeAnimations() {
  // Animación de contadores
  animateCounters();
  
  // Animación de floating cards
  const floatingCards = document.querySelectorAll('.floating-card');
  floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 2}s`;
  });
}

// Animación de contadores
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.textContent.replace(',', ''));
        animateCounter(counter, target);
        observer.unobserve(counter);
      }
    });
  });
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(counter, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    counter.textContent = Math.floor(current).toLocaleString();
  }, 50);
}

// Mostrar sección específica
function showSection(sectionId) {
  currentSection = sectionId;
  
  // Ocultar todas las secciones
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Mostrar la sección seleccionada
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    
    // Cargar contenido específico de la sección
    loadSectionContent(sectionId);
    
    // Mantener el sidebar abierto cuando se navega a la sección de administradores
    if (sectionId === 'admin') {
      keepSidebarOpen();
    }
    
    // Actualizar navegación activa
    updateActiveNavigation(sectionId);
  }
}

// Cargar contenido específico de cada sección
function loadSectionContent(sectionId) {
  switch(sectionId) {
    case 'materias':
      loadSubjectsTable();
      break;
    case 'inscripciones':
      loadInscriptionDatesTable();
      break;
    case 'pagos':
      loadPaymentDatesTable();
      break;
    case 'documentos':
      loadDocumentsTable();
      break;
    case 'reportes':
      loadFinancialReportsTable();
      break;
    case 'admin':
      loadAdminsSection();
      break;
    case 'usuarios':
      loadUsuariosSection();
      break;
  }
}

// Funciones para cargar tablas con Bootstrap (solo lectura para usuarios no autenticados)
async function loadSubjectsTable() {
  const container = document.getElementById('materias-content');
  if (!container) return;
  let subjects = [];
  try {
    subjects = await fetchSubjects();
    console.log('Materias recibidas:', subjects);
  } catch (err) {
    console.error('Error al obtener materias:', err);
    container.innerHTML = '<div class="alert alert-danger">Error al cargar materias. Revisa la consola.</div>';
    return;
  }
  const canEdit = isLoggedIn;

  if (!subjects || subjects.length === 0) {
    container.innerHTML = '<div class="alert alert-info">No hay materias registradas.</div>';
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Año Académico</th>
            <th>Descripción</th>
            ${canEdit ? '<th>Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${subjects.map(subject => `
            <tr>
              <td><span class="badge bg-secondary">${subject.id}</span></td>
              <td><strong>${subject.nombre}</strong></td>
              <td><span class="badge bg-info">${subject.anio_academico}</span></td>
              <td>${subject.descripcion}</td>
              ${canEdit ? `
                <td>
                  <div class="btn-group" role="group">
                    <!-- Aquí puedes agregar botones de editar/eliminar -->
                  </div>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${canEdit ? `
      <div class="mt-3">
        <button class="btn btn-primary btn-add" data-type="subject">
          <i class="fas fa-plus me-2"></i>Agregar Materia
        </button>
      </div>
    ` : ''}
  `;
}

function loadInscriptionDatesTable() {
  const container = document.getElementById('inscripciones-content');
  if (!container) return;
  
  const canEdit = isLoggedIn;
  
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Descripción</th>
            <th>Año Académico</th>
            ${canEdit ? '<th>Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${systemData.inscriptionDates.map(date => `
            <tr>
              <td><span class="badge bg-secondary">${date.id}</span></td>
              <td><span class="badge bg-success">${formatDate(date.fecha_inicio)}</span></td>
              <td><span class="badge bg-warning text-dark">${formatDate(date.fecha_fin)}</span></td>
              <td>${date.descripcion}</td>
              <td><span class="badge bg-info">${date.anio_academico}</span></td>
              ${canEdit ? `
                <td>
                  <div class="btn-group" role="group">
                    <button class="btn btn-outline-primary btn-sm btn-edit" data-type="inscription" data-id="${date.id}">
                      <i class="fas fa-edit me-1"></i>Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-delete" data-type="inscription" data-id="${date.id}">
                      <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${canEdit ? `
      <div class="mt-3">
        <button class="btn btn-primary btn-add" data-type="inscription">
          <i class="fas fa-plus me-2"></i>Agregar Fecha
        </button>
      </div>
    ` : `
      <div class="mt-3">
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Solo los administradores pueden modificar esta información. 
          <a href="#admin" class="alert-link">Inicia sesión aquí</a>
        </div>
      </div>
    `}
  `;
}

function loadPaymentDatesTable() {
  const container = document.getElementById('pagos-content');
  if (!container) return;
  
  const canEdit = isLoggedIn;
  
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Tipo de Pago</th>
            <th>Año Académico</th>
            ${canEdit ? '<th>Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${systemData.paymentDates.map(payment => `
            <tr>
              <td><span class="badge bg-secondary">${payment.id}</span></td>
              <td><span class="badge bg-success">${formatDate(payment.fecha)}</span></td>
              <td>${payment.descripcion}</td>
              <td><span class="badge bg-primary">$${payment.monto.toFixed(2)}</span></td>
              <td><span class="badge bg-info">${payment.tipo_pago}</span></td>
              <td><span class="badge bg-warning text-dark">${payment.anio_academico}</span></td>
              ${canEdit ? `
                <td>
                  <div class="btn-group" role="group">
                    <button class="btn btn-outline-primary btn-sm btn-edit" data-type="payment" data-id="${payment.id}">
                      <i class="fas fa-edit me-1"></i>Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-delete" data-type="payment" data-id="${payment.id}">
                      <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${canEdit ? `
      <div class="mt-3">
        <button class="btn btn-primary btn-add" data-type="payment">
          <i class="fas fa-plus me-2"></i>Agregar Pago
        </button>
      </div>
    ` : `
      <div class="mt-3">
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Solo los administradores pueden modificar esta información. 
          <a href="#admin" class="alert-link">Inicia sesión aquí</a>
        </div>
      </div>
    `}
  `;
}

function loadDocumentsTable() {
  const container = document.getElementById('documentos-content');
  if (!container) return;
  
  const canEdit = isLoggedIn;
  
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Fecha Subida</th>
            ${canEdit ? '<th>Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${systemData.documents.map(doc => `
            <tr>
              <td><span class="badge bg-secondary">${doc.id}</span></td>
              <td><strong>${doc.nombre}</strong></td>
              <td>${doc.descripcion}</td>
              <td><span class="badge bg-info">${doc.tipo_documento}</span></td>
              <td><span class="badge bg-success">${formatDate(doc.fecha_subida)}</span></td>
              ${canEdit ? `
                <td>
                  <div class="btn-group" role="group">
                    <button class="btn btn-outline-primary btn-sm btn-edit" data-type="document" data-id="${doc.id}">
                      <i class="fas fa-edit me-1"></i>Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-delete" data-type="document" data-id="${doc.id}">
                      <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${canEdit ? `
      <div class="mt-3">
        <button class="btn btn-primary btn-add" data-type="document">
          <i class="fas fa-plus me-2"></i>Agregar Documento
        </button>
      </div>
    ` : `
      <div class="mt-3">
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Solo los administradores pueden modificar esta información. 
          <a href="#admin" class="alert-link">Inicia sesión aquí</a>
        </div>
      </div>
    `}
  `;
}

function loadFinancialReportsTable() {
  const container = document.getElementById('reportes-content');
  if (!container) return;
  
  const canEdit = isLoggedIn;
  
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Fecha Reporte</th>
            <th>Fecha Subida</th>
            ${canEdit ? '<th>Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${systemData.financialReports.map(report => `
            <tr>
              <td><span class="badge bg-secondary">${report.id}</span></td>
              <td><strong>${report.nombre}</strong></td>
              <td>${report.descripcion}</td>
              <td><span class="badge bg-info">${report.tipo_reporte}</span></td>
              <td><span class="badge bg-success">${formatDate(report.fecha_reporte)}</span></td>
              <td><span class="badge bg-warning text-dark">${formatDate(report.fecha_subida)}</span></td>
              ${canEdit ? `
                <td>
                  <div class="btn-group" role="group">
                    <button class="btn btn-outline-primary btn-sm btn-edit" data-type="report" data-id="${report.id}">
                      <i class="fas fa-edit me-1"></i>Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-delete" data-type="report" data-id="${report.id}">
                      <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${canEdit ? `
      <div class="mt-3">
        <button class="btn btn-primary btn-add" data-type="report">
          <i class="fas fa-plus me-2"></i>Agregar Reporte
        </button>
      </div>
    ` : `
      <div class="mt-3">
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Solo los administradores pueden modificar esta información. 
          <a href="#admin" class="alert-link">Inicia sesión aquí</a>
        </div>
      </div>
    `}
  `;
}

function loadAdminsSection() {
  const container = document.getElementById('admin-content');
  if (!container) return;
  
  if (isLoggedIn) {
    // Mostrar panel de administración
    container.innerHTML = `
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="fas fa-users-cog me-2"></i>
                Panel de Administración
              </h5>
            </div>
            <div class="card-body">
              <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i>
                <strong>Bienvenido, ${currentAdmin.nombre}!</strong>
                <br>
                Has iniciado sesión correctamente. Ahora puedes modificar toda la información del sistema.
              </div>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="card bg-light admin-panel-hover">
                    <div class="card-body text-center">
                      <i class="fas fa-user-shield fs-1 text-primary mb-3"></i>
                      <h6>Administrador Activo</h6>
                      <p class="text-muted mb-0">${currentAdmin.email}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card bg-light admin-panel-hover">
                    <div class="card-body text-center">
                      <i class="fas fa-clock fs-1 text-success mb-3"></i>
                      <h6>Sesión Activa</h6>
                      <p class="text-muted mb-0">${new Date().toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <h6>Acciones Disponibles:</h6>
                <div class="row g-2">
                  <div class="col-md-6">
                    <a href="#materias" class="btn btn-outline-primary w-100 mb-2">
                      <i class="fas fa-book me-2"></i>Gestionar Materias
                    </a>
                  </div>
                  <div class="col-md-6">
                    <a href="#inscripciones" class="btn btn-outline-success w-100 mb-2">
                      <i class="fas fa-calendar me-2"></i>Gestionar Inscripciones
                    </a>
                  </div>
                  <div class="col-md-6">
                    <a href="#pagos" class="btn btn-outline-warning w-100 mb-2">
                      <i class="fas fa-credit-card me-2"></i>Gestionar Pagos
                    </a>
                  </div>
                  <div class="col-md-6">
                    <a href="#documentos" class="btn btn-outline-info w-100 mb-2">
                      <i class="fas fa-file me-2"></i>Gestionar Documentos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h6 class="mb-0">
                <i class="fas fa-cog me-2"></i>
                Configuración
              </h6>
            </div>
            <div class="card-body">
              <button class="btn btn-danger w-100 btn-logout">
                <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Mostrar formulario de login
    container.innerHTML = `
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-header bg-primary text-white text-center">
              <h5 class="mb-0">
                <i class="fas fa-user-shield me-2"></i>
                Acceso Administrativo
              </h5>
            </div>
            <div class="card-body">
              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Solo los administradores autorizados pueden acceder a esta sección.
              </div>
              
              <form id="adminLoginForm">
                <div class="mb-3">
                  <label class="form-label">Email:</label>
                  <input type="email" class="form-control" name="email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña:</label>
                  <input type="password" class="form-control" name="password" required>
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
                  </button>
                </div>
              </form>
              
              <div class="mt-3 text-center">
                <a href="#" class="forgot-password-link text-decoration-none">
                  <i class="fas fa-key me-1"></i>
                  ¿Olvidaste tus credenciales?
                </a>
              </div>
              
              <div class="mt-3 text-center">
                <small class="text-muted">
                  <i class="fas fa-shield-alt me-1"></i>
                  Acceso restringido a administradores
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Event listener para el formulario de login
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const email = formData.get('email');
      const password = formData.get('password');
      
      // Verificar credenciales
      const admin = systemData.admins.find(a => a.email === email && a.password === password);
      
      if (admin) {
        isLoggedIn = true;
        currentAdmin = admin;
        updateAuthenticationStatus();
        loadAdminsSection(); // Recargar la sección
        showAlert('Sesión iniciada correctamente', 'success');
        saveToLocalStorage();
      } else {
        showAlert('Credenciales incorrectas', 'error');
      }
    });
  }
}

// --- MOSTRAR MODAL DE USUARIO (EJEMPLO) ---
function showUserModal(tipo, user = null) {
  const isEdit = tipo === 'editar';
  const content = `
    <form id="userForm">
      <div class="mb-3">
        <label class="form-label">Nombre:</label>
        <input type="text" class="form-control" name="nombre" value="${user ? user.nombre : ''}" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Email:</label>
        <input type="email" class="form-control" name="email" value="${user ? user.email : ''}" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Rol:</label>
        <select class="form-select" name="rol" required>
          <option value="Superadmin" ${user && user.rol === 'Superadmin' ? 'selected' : ''}>Superadmin</option>
          <option value="Administrador" ${user && user.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Estado:</label>
        <select class="form-select" name="estado" required>
          <option value="Activo" ${user && user.estado === 'Activo' ? 'selected' : ''}>Activo</option>
          <option value="Inactivo" ${user && user.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">${isEdit ? 'Nueva contraseña (opcional):' : 'Contraseña:'}</label>
        <input type="password" class="form-control" name="password" ${isEdit ? '' : 'required'}>
      </div>
      <div class="d-grid">
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save me-2"></i>Guardar
        </button>
      </div>
    </form>
  `;
  showModal(content);
}

function showForgotPasswordModal() {
  const content = `
    <div class="text-center mb-4">
      <i class="fas fa-key fs-1 text-primary mb-3"></i>
      <h5>Recuperar Credenciales</h5>
      <p class="text-muted">Ingresa tu email para recibir instrucciones de recuperación</p>
    </div>
    
    <form id="forgotPasswordForm">
      <div class="mb-3">
        <label class="form-label">Email del Administrador:</label>
        <input type="email" class="form-control" name="email" required 
               placeholder="admin@ambrosio-plaza.edu.ve">
      </div>
      
      <div class="d-grid">
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-paper-plane me-2"></i>Enviar Instrucciones
        </button>
      </div>
    </form>
    
    <div class="mt-3">
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Nota:</strong> En un entorno de producción, se enviaría un email con instrucciones de recuperación.
      </div>
    </div>
  `;
  
  showModal(content);
  
  // Event listener para el formulario de recuperación
  document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const email = formData.get('email');
    
    // Verificar si el email existe
    const admin = systemData.admins.find(a => a.email === email);
    
    if (admin) {
      closeModal();
      showAlert(`Se han enviado instrucciones de recuperación a ${email}`, 'success');
      
      // Simular envío de credenciales (en producción esto sería por email)
      setTimeout(() => {
        showAlert(`Credenciales de recuperación para ${admin.email}: Contraseña: ${admin.password}`, 'info');
      }, 2000);
    } else {
      showAlert('No se encontró un administrador con ese email', 'error');
    }
  });
}

// Funciones utilitarias
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
}

// Función para mantener el sidebar abierto
function keepSidebarOpen() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  
  if (sidebar && mainContent) {
    // En móviles, mantener abierto
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('collapsed');
      sidebar.classList.add('open');
      mainContent.classList.remove('expanded');
      sidebarCollapsed = false;
    } else {
      // En desktop, abrir si está cerrado
      if (sidebarCollapsed) {
        sidebar.classList.remove('collapsed');
        sidebar.classList.remove('open');
        mainContent.classList.remove('expanded');
        sidebarCollapsed = false;
      }
    }
  }
}

// Función para actualizar la navegación activa
function updateActiveNavigation(sectionId) {
  // Remover clase active de todos los enlaces de navegación
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Agregar clase active al enlace correspondiente a la sección actual
  const activeNavLink = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeNavLink) {
    activeNavLink.classList.add('active');
  }
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

function showModal(content) {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.setAttribute('tabindex', '-1');
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sistema de Gestión</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Inicializar el modal de Bootstrap
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
  
  // Limpiar el modal cuando se cierre
  modal.addEventListener('hidden.bs.modal', function() {
    modal.remove();
  });
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  }
}

function showAddModal(type) {
  let content = '';
  switch(type) {
    case 'subject':
      content = `
        <form id="addForm">
          <div class="mb-3">
            <label class="form-label">Nombre:</label>
            <input type="text" class="form-control" name="nombre" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Año Académico:</label>
            <input type="number" class="form-control" name="anio_academico" value="2024" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción:</label>
            <textarea class="form-control" name="descripcion" rows="3" required></textarea>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Agregar
            </button>
          </div>
        </form>
      `;
      break;
    case 'inscription':
      content = `
        <form id="addForm">
          <div class="mb-3">
            <label class="form-label">Fecha Inicio:</label>
            <input type="date" class="form-control" name="fecha_inicio" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Fecha Fin:</label>
            <input type="date" class="form-control" name="fecha_fin" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción:</label>
            <textarea class="form-control" name="descripcion" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Año Académico:</label>
            <input type="number" class="form-control" name="anio_academico" value="2024" required>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Agregar
            </button>
          </div>
        </form>
      `;
      break;
    case 'payment':
      content = `
        <form id="addForm">
          <div class="mb-3">
            <label class="form-label">Fecha:</label>
            <input type="date" class="form-control" name="fecha" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción:</label>
            <textarea class="form-control" name="descripcion" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Monto:</label>
            <input type="number" class="form-control" name="monto" step="0.01" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Tipo de Pago:</label>
            <select class="form-select" name="tipo_pago" required>
              <option value="Inscripción">Inscripción</option>
              <option value="Matrícula">Matrícula</option>
              <option value="Mensualidad">Mensualidad</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Año Académico:</label>
            <input type="number" class="form-control" name="anio_academico" value="2024" required>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Agregar
            </button>
          </div>
        </form>
      `;
      break;
    case 'document':
      content = `
        <form id="addForm">
          <div class="mb-3">
            <label class="form-label">Nombre:</label>
            <input type="text" class="form-control" name="nombre" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción:</label>
            <textarea class="form-control" name="descripcion" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Tipo de Documento:</label>
            <select class="form-select" name="tipo_documento" required>
              <option value="Reglamento">Reglamento</option>
              <option value="Manual">Manual</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">URL:</label>
            <input type="url" class="form-control" name="url" required>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Agregar
            </button>
          </div>
        </form>
      `;
      break;
    case 'report':
      content = `
        <form id="addForm">
          <div class="mb-3">
            <label class="form-label">Nombre:</label>
            <input type="text" class="form-control" name="nombre" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción:</label>
            <textarea class="form-control" name="descripcion" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Tipo de Reporte:</label>
            <select class="form-select" name="tipo_reporte" required>
              <option value="Mensual">Mensual</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Fecha Reporte:</label>
            <input type="date" class="form-control" name="fecha_reporte" required>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Agregar
            </button>
          </div>
        </form>
      `;
      break;
  }
  showModal(content);
  // Event listener para el formulario de materias
  if(type === 'subject') {
    document.getElementById('addForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = {
        nombre: formData.get('nombre'),
        anio_academico: formData.get('anio_academico'),
        descripcion: formData.get('descripcion')
      };
      await addSubject(data);
      closeModal();
      loadSubjectsTable();
    });
  }
}

async function addSubject(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      addSubject(data);
      resolve();
    }, 500);
  });
}

async function updateSubject(id, data) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateSubject(id, data);
      resolve();
    }, 500);
  });
}

async function deleteSubject(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      deleteItem('subject', id);
      resolve();
    }, 500);
  });
}

async function addInscriptionDate(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      addInscriptionDate(data);
      resolve();
    }, 500);
  });
}

async function updateInscriptionDate(id, data) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateInscriptionDate(id, data);
      resolve();
    }, 500);
  });
}

async function deleteInscriptionDate(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      deleteItem('inscription', id);
      resolve();
    }, 500);
  });
}

async function addPaymentDate(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      addPaymentDate(data);
      resolve();
    }, 500);
  });
}

async function updatePaymentDate(id, data) {
  return new Promise(resolve => {
    setTimeout(() => {
      updatePaymentDate(id, data);
      resolve();
    }, 500);
  });
}

async function deletePaymentDate(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      deleteItem('payment', id);
      resolve();
    }, 500);
  });
}

async function addDocument(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      addDocument(data);
      resolve();
    }, 500);
  });
}

async function updateDocument(id, data) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateDocument(id, data);
      resolve();
    }, 500);
  });
}

async function deleteDocument(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      deleteItem('document', id);
      resolve();
    }, 500);
  });
}

async function addFinancialReport(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      addFinancialReport(data);
      resolve();
    }, 500);
  });
}

async function updateFinancialReport(id, data) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateFinancialReport(id, data);
      resolve();
    }, 500);
  });
}

async function deleteFinancialReport(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      deleteItem('report', id);
      resolve();
    }, 500);
  });
}

async function addUser(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      addUser(data);
      resolve();
    }, 500);
  });
}

async function updateUser(id, data) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateUser(id, data);
      resolve();
    }, 500);
  });
}

async function deleteUser(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      deleteUser(id);
      resolve();
    }, 500);
  });
}

async function activateUser(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      activateUser(id);
      resolve();
    }, 500);
  });
}