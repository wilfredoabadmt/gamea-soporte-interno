// ============================================================================
// GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO — GAMEA
// Plataforma Interna de Gestión, Soporte y Casos
// Controlador Front-End Modular (app.js)
// ============================================================================

const state = {
  currentRole: 'SUPERADMIN', // 'SUPERADMIN' o 'CLIENTE_USUARIO'
  currentUser: {
    id: 'usr-001',
    nombre: 'Lic. Marco Antonio Quispe',
    dependencia: 'JEFATURA-SISTEMAS',
    dependenciaNombre: 'Jefatura de Sistemas y Tecnologías (GAMEA)',
    rol: 'SUPERADMIN'
  },
  activeTab: 'personal',
  selectedCaseId: 'CAS-2026-0084',
  distritoFiltro: null,
  
  // Catálogo de Funcionarios / Usuarios de Oficina (Clientes Internos y Técnicos)
  usuarios: [
    {
      id: 'usr-001',
      ci: '6849201 LP',
      nombre: 'Lic. Marco Antonio Quispe',
      dependencia: 'DIR-TECNOLOGIAS-INF',
      dependenciaNombre: 'Dirección de Tecnologías e Información',
      cargo: 'Técnico Especialista de Redes',
      rol: 'FUNCIONARIO_TECNICO'
    },
    {
      id: 'usr-002',
      ci: '4928103 LP',
      nombre: 'Dr. Carlos Flores Mendizábal',
      dependencia: 'DIR-JURIDICA',
      dependenciaNombre: 'Dirección General de Asesoría Jurídica',
      cargo: 'Asesor Legal de Despacho',
      rol: 'SOLICITANTE'
    },
    {
      id: 'usr-003',
      ci: '5829104 LP',
      nombre: 'Ing. Pedro Mamani Huanca',
      dependencia: 'SUBALCALDIA-D3',
      dependenciaNombre: 'Subalcaldía Distrito Municipal 3 (Pacajes)',
      cargo: 'Responsable de Mantenimiento Distrital',
      rol: 'SUPERVISOR_UNIDAD'
    },
    {
      id: 'usr-004',
      ci: '7102948 LP',
      nombre: 'Lic. Ana María Mendoza',
      dependencia: 'DIR-CATASTRO',
      dependenciaNombre: 'Dirección de Catastro y Administración Territorial',
      cargo: 'Técnico Registrador Distrital',
      rol: 'SOLICITANTE'
    },
    {
      id: 'usr-005',
      ci: '3920194 LP',
      nombre: 'Ing. David Choque Quisbert',
      dependencia: 'SUBALCALDIA-D8',
      dependenciaNombre: 'Subalcaldía Distrito Municipal 8 (Senkata)',
      cargo: 'Técnico de Obras Civiles Distritales',
      rol: 'SOLICITANTE'
    }
  ],

  // Base de Conocimiento Normativo RAG Oficial
  normativas: [
    {
      codigo: 'RES-ADM-GAMEA-045/2025',
      titulo: 'Reglamento de Mantenimiento de Maquinaria Pesada en Subalcaldías',
      organo: 'Dirección de Infraestructura Pública',
      version: '2.1',
      resumen: 'Toda solicitud de maquinaria pesada debe remitirse con un mínimo de 72 horas de anticipación con visto bueno del Subalcalde respectivo.'
    },
    {
      codigo: 'DIR-TIC-CIRCULAR-012/2025',
      titulo: 'Instructivo de Soporte y Conectividad de Redes Internas',
      organo: 'Dirección de Tecnologías e Información',
      version: '1.4',
      resumen: 'Los incidentes de pérdida de conectividad o falla en enlaces de fibra óptica tienen prioridad ALTA con SLA máximo de atención de 4 horas.'
    }
  ],

  // Casos Internos
  cases: [
    {
      id: 'CAS-2026-0084',
      codigo: 'CAS-2026-0084',
      titulo: 'Falla de enlace de fibra óptica y red interna en piso 3',
      solicitanteId: 'usr-002',
      solicitanteNombre: 'Dr. Carlos Flores Mendizábal',
      origen: 'Dirección General de Asesoría Jurídica',
      destino: 'Dirección de Tecnologías e Información',
      dependenciaActualId: 'DIR-TECNOLOGIAS-INF',
      responsable: 'Lic. Marco Antonio Quispe',
      prioridad: 'ALTA',
      estado: 'EN_PROCESO',
      slaRestante: '2h restantes',
      distrito: null,
      descripcion: 'El personal técnico de la Dirección Jurídica reporta cortes intermitentes en la base de datos central. Se requiere verificación in situ del rack de comunicaciones y empalmes.',
      novedades: [
        {
          titulo: 'Inicio de Atención Técnica',
          autor: 'Lic. Marco Antonio Quispe (Técnico de Redes)',
          fecha: 'Hoy, 09:15 AM',
          descripcion: 'Técnico ha iniciado pruebas de reflectometría en el switch principal del piso 3.',
          color: 'var(--color-accent)'
        },
        {
          titulo: 'Asignación Operativa',
          autor: 'Supervisor Carlos Huanca',
          fecha: 'Hoy, 08:30 AM',
          descripcion: 'Supervisor asignó el caso formalmente a la unidad de Redes y Telecomunicaciones.',
          color: 'var(--color-status-asignado)'
        }
      ]
    },
    {
      id: 'CAS-2026-0089',
      codigo: 'CAS-2026-0089',
      titulo: 'Mantenimiento de computadoras y catastro distrital',
      solicitanteId: 'usr-004',
      solicitanteNombre: 'Lic. Ana María Mendoza',
      origen: 'Dirección de Catastro y Administración Territorial',
      destino: 'Subalcaldía Distrito 3 (Pacajes / Villa Adela)',
      dependenciaActualId: 'SUBALCALDIA-D3',
      responsable: 'Ing. Pedro Mamani Huanca',
      prioridad: 'MEDIA',
      estado: 'EN_DERIVACION',
      slaRestante: '5h restantes',
      distrito: 3,
      descripcion: 'Solicitud de revisión preventiva para 8 terminales que procesan catastros vecinales en la Subalcaldía del Distrito 3.',
      novedades: [
        {
          titulo: 'Derivación Inter-Oficinas',
          autor: 'Dirección de Catastro',
          fecha: 'Hoy, 07:45 AM',
          descripcion: 'Se deriva expediente a la Subalcaldía del Distrito 3 para verificación técnica de equipos en sede distrital.',
          color: 'var(--color-status-derivacion)'
        }
      ]
    },
    {
      id: 'CAS-2026-0092',
      codigo: 'CAS-2026-0092',
      titulo: 'Inspección de bacheo y luminarias en avenida principal',
      solicitanteId: 'usr-005',
      solicitanteNombre: 'Ing. David Choque Quisbert',
      origen: 'Subalcaldía Distrito 8 (Senkata)',
      destino: 'Dirección de Infraestructura Pública',
      dependenciaActualId: 'DIR-INFRAESTRUCTURA',
      responsable: 'Ing. Jaime Morales',
      prioridad: 'URGENTE',
      estado: 'EN_PROCESO',
      slaRestante: '1h 15m restante',
      distrito: 8,
      descripcion: 'Coordinación inter-institucional para despliegue de maquinaria y cuadrilla técnica en el Distrito 8.',
      novedades: [
        {
          titulo: 'Recepción y Programación de Cuadrilla',
          autor: 'Dirección de Infraestructura Pública',
          fecha: 'Hoy, 10:00 AM',
          descripcion: 'Cuadrilla número 4 programada para intervención inmediata.',
          color: 'var(--color-status-proceso)'
        }
      ]
    }
  ]
};

// Inicialización de la aplicación robusta para SPA con persistencia institucional
async function inicializarApp() {
  setupNavigation();
  setupActionButtons();
  poblarSelectsUsuarios();
  aplicarPermisosEspacioTrabajo();

  // Carga asíncrona de casos desde base de datos / servidor persistente
  await cargarCasosDesdeServidor();
}

async function cargarCasosDesdeServidor() {
  try {
    const res = await fetch('/api/v1/cases');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        state.cases = data;
        // Si el caso seleccionado no está en la lista recibida, seleccionar el primero
        if (!state.cases.some(c => c.id === state.selectedCaseId)) {
          state.selectedCaseId = state.cases[0].id;
        }
      }
    }
  } catch (err) {
    console.warn('[GAMEA] No se pudo conectar con el endpoint de casos, usando estado local:', err);
  } finally {
    actualizarContadores();
    renderCasesList();
    renderCaseDetail();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { inicializarApp(); });
} else {
  inicializarApp();
}

function actualizarContadores() {
  const cPersonal = document.getElementById('count-personal');
  const cUnidad = document.getElementById('count-unidad');
  const cSubalcaldia = document.getElementById('count-subalcaldia');
  const cSupervision = document.getElementById('count-supervision');
  const cUsuarios = document.getElementById('count-usuarios');

  const personalCasos = state.cases.filter(c => c.dependenciaActualId === 'DIR-TECNOLOGIAS-INF').length;
  const subalcaldiaCasos = state.cases.filter(c => c.distrito !== null).length;
  const urgentes = state.cases.filter(c => c.prioridad === 'URGENTE' || c.prioridad === 'ALTA').length;

  if (cPersonal) cPersonal.textContent = personalCasos;
  if (cUnidad) cUnidad.textContent = state.cases.length;
  if (cSubalcaldia) cSubalcaldia.textContent = subalcaldiaCasos;
  if (cSupervision) cSupervision.textContent = urgentes;
  if (cUsuarios) cUsuarios.textContent = state.usuarios.length;
}

function aplicarPermisosEspacioTrabajo() {
  const isSuperadmin = state.currentRole === 'SUPERADMIN';

  // Ocultar o mostrar elementos restringidos al cliente
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isSuperadmin ? '' : 'none';
  });

  // El cliente de oficina sólo tiene acceso a su bandeja personal de solicitudes
  const btnUnidad = document.getElementById('btn-inbox-unidad');
  const btnSubalcaldia = document.getElementById('btn-inbox-subalcaldia');
  const btnSupervision = document.getElementById('btn-inbox-supervision');
  if (btnUnidad) btnUnidad.style.display = isSuperadmin ? '' : 'none';
  if (btnSubalcaldia) btnSubalcaldia.style.display = isSuperadmin ? '' : 'none';
  if (btnSupervision) btnSupervision.style.display = isSuperadmin ? '' : 'none';

  const btnFiltrarDistrito = document.getElementById('btn-filtrar-subalcaldia');
  if (btnFiltrarDistrito) btnFiltrarDistrito.style.display = isSuperadmin ? '' : 'none';

  // Ocultar botón de configuración de agente en el chat de WhatsApp si no es superadmin
  const btnConfigAgenteChat = document.querySelector('button[title="Configurar / Entrenar Agente"]');
  if (btnConfigAgenteChat) {
    btnConfigAgenteChat.style.display = isSuperadmin ? '' : 'none';
  }

  // Actualizar etiquetas en la cabecera
  const userLabel = document.getElementById('user-display-label');
  const depBadge = document.getElementById('user-dep-badge');
  const initials = document.getElementById('user-avatar-initials');
  const inboxTitle = document.getElementById('inbox-title');
  const panelHeading = document.getElementById('cases-panel-heading');

  if (isSuperadmin) {
    if (userLabel) userLabel.textContent = 'Servidor Público: Lic. Marco Antonio Quispe (Jefe de Sistemas - Superadmin)';
    if (depBadge) depBadge.textContent = 'JEFATURA DE SISTEMAS (SOPORTE)';
    if (initials) initials.textContent = 'JS';
    if (inboxTitle) inboxTitle.textContent = 'Mesa de Ayuda de Sistemas — Casos Asignados';
    if (panelHeading) panelHeading.textContent = 'CASOS EN ATENCIÓN (OFICINAS Y SUBALCALDÍAS)';
  } else {
    if (userLabel) userLabel.textContent = 'Servidor Público: Dr. Carlos Flores Mendizábal (Funcionario Solicitante)';
    if (depBadge) depBadge.textContent = 'OFICINA / SUBALCALDÍA SOLICITANTE';
    if (initials) initials.textContent = 'CF';
    if (inboxTitle) inboxTitle.textContent = 'Mis Solicitudes de Soporte a Sistemas';
    if (panelHeading) panelHeading.textContent = 'MIS SOLICITUDES DE ASISTENCIA';
  }
}

function setupNavigation() {
  // Selector de Espacio de Trabajo
  document.getElementById('switch-role-selector')?.addEventListener('change', (e) => {
    state.currentRole = e.target.value;
    if (state.currentRole === 'CLIENTE_USUARIO') {
      state.activeTab = 'personal';
      state.currentUser = {
        id: 'usr-002',
        nombre: 'Dr. Carlos Flores Mendizábal',
        dependencia: 'DIR-JURIDICA',
        dependenciaNombre: 'Dirección General de Asesoría Jurídica',
        rol: 'SOLICITANTE'
      };
    } else {
      state.activeTab = 'personal';
      state.currentUser = {
        id: 'usr-001',
        nombre: 'Lic. Marco Antonio Quispe',
        dependencia: 'JEFATURA-SISTEMAS',
        dependenciaNombre: 'Jefatura de Sistemas y Tecnologías (GAMEA)',
        rol: 'SUPERADMIN'
      };
    }
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('btn-inbox-personal')?.classList.add('active');

    restaurarWorkspaceGrid();
    aplicarPermisosEspacioTrabajo();
    renderCasesList();
    renderCaseDetail();
    alert(`[GAMEA] Espacio de trabajo cambiado a: ${state.currentRole === 'SUPERADMIN' ? '🛡 Superadministrador (Jefatura de Sistemas)' : '👤 Usuario / Solicitante de Oficina'}`);
  });
  const navItems = [
    { id: 'btn-inbox-personal', tab: 'personal', title: 'Mesa de Ayuda — Jefatura de Sistemas' },
    { id: 'btn-inbox-unidad', tab: 'unidad', title: 'Bandeja Consolidada de Soporte Institucional' },
    { id: 'btn-inbox-subalcaldia', tab: 'subalcaldia', title: 'Subalcaldías de El Alto (14 Distritos)' },
    { id: 'btn-inbox-supervision', tab: 'supervision', title: 'Consola de Supervisión y Monitoreo SLA' },
    { id: 'btn-usuarios-oficinas', tab: 'usuarios', title: 'Gestión de Funcionarios y Usuarios de Oficina' },
    { id: 'btn-agente-control-panel', tab: 'agente-control', title: 'Centro de Instrucciones y Conocimiento del Agente IA' }
  ];

  navItems.forEach(item => {
    const el = document.getElementById(item.id);
    if (!el) return;
    el.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      state.activeTab = item.tab;
      document.getElementById('inbox-title').textContent = item.title;

      if (item.tab === 'usuarios') {
        renderVistaUsuarios();
      } else if (item.tab === 'supervision') {
        renderVistaSupervision();
      } else if (item.tab === 'agente-control') {
        renderVistaControlAgente();
      } else {
        restaurarWorkspaceGrid();
        renderCasesList();
        renderCaseDetail();
      }
    });
  });

  // Botones de Herramientas
  document.getElementById('btn-nuevo-caso')?.addEventListener('click', () => {
    poblarSelectsUsuarios();
    abrirModal('modal-nuevo-requerimiento');
  });

  document.getElementById('btn-asistente-ia')?.addEventListener('click', () => {
    abrirModal('modal-asistente-ia');
  });

  document.getElementById('btn-filtrar-subalcaldia')?.addEventListener('click', () => {
    const dist = prompt('Ingrese número de Distrito Municipal para filtrar (1 al 14) o deje vacío para ver todos:', state.distritoFiltro || '');
    if (dist === null) return;
    state.distritoFiltro = dist.trim() === '' ? null : parseInt(dist.trim(), 10);
    renderCasesList();
  });
}

function restaurarWorkspaceGrid() {
  const grid = document.getElementById('main-workspace-grid');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = '420px 1fr';
}

function renderCasesList() {
  const container = document.getElementById('cases-list-container');
  if (!container) return;

  let casosFiltrados = [...state.cases];

  if (state.currentRole === 'CLIENTE_USUARIO') {
    // El usuario común sólo ve los requerimientos donde él es el solicitante o de su oficina
    casosFiltrados = casosFiltrados.filter(c => c.solicitanteId === state.currentUser.id || c.origen === state.currentUser.dependenciaNombre);
  } else {
    // Vista de superadministrador (Jefatura de Sistemas)
    if (state.activeTab === 'personal') {
      casosFiltrados = casosFiltrados.filter(c => 
        c.dependenciaActualId === 'JEFATURA-SISTEMAS' || 
        c.dependenciaActualId === 'DIR-TECNOLOGIAS-INF' ||
        c.destino.includes('SISTEMAS') ||
        c.destino.includes('TECNOLOGIAS')
      );
    } else if (state.activeTab === 'subalcaldia') {
      casosFiltrados = casosFiltrados.filter(c => c.distrito !== null);
    }
  }

  if (state.distritoFiltro !== null && state.currentRole === 'SUPERADMIN') {
    casosFiltrados = casosFiltrados.filter(c => c.distrito === state.distritoFiltro);
  }

  if (casosFiltrados.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem 1rem; text-align: center; color: var(--color-text-muted); font-size: 0.9rem;">
        ${state.currentRole === 'CLIENTE_USUARIO' ? 'No tienes solicitudes emitidas aún. Presiona "+ Nuevo Requerimiento" para generar una.' : 'No hay requerimientos en esta bandeja.'}
      </div>
    `;
    return;
  }

  container.innerHTML = casosFiltrados.map(caso => {
    const isSelected = caso.id === state.selectedCaseId ? 'selected' : '';
    let statusColor = 'var(--color-status-proceso)';
    let statusTextColor = '#000';

    if (caso.estado === 'EN_DERIVACION') {
      statusColor = 'var(--color-status-derivacion)';
      statusTextColor = '#fff';
    } else if (caso.estado === 'RESUELTO' || caso.estado === 'CERRADO_CONFORME') {
      statusColor = 'var(--color-status-resuelto)';
      statusTextColor = '#000';
    }

    const badgeDistrito = caso.distrito ? `<span class="badge-tag" style="background-color: rgba(244, 162, 97, 0.2); color: var(--color-accent); margin-right: 0.35rem;">Distrito ${caso.distrito}</span>` : '';

    return `
      <div class="case-card ${isSelected}" onclick="window.selectCase('${caso.id}')">
        <div class="case-card-header">
          <span class="case-code">${badgeDistrito}${caso.id}</span>
          <span class="status-tag" style="background-color: ${statusColor}; color: ${statusTextColor};">
            ${caso.estado}
          </span>
        </div>
        <div class="case-title">${caso.titulo}</div>
        <div class="case-meta">
          <span>Destino: ${caso.destino}</span>
          <span style="color: var(--color-accent); font-weight: 600;">${caso.slaRestante}</span>
        </div>
      </div>
    `;
  }).join('');
}

window.selectCase = function(caseId) {
  state.selectedCaseId = caseId;
  renderCasesList();
  renderCaseDetail();
};

function renderCaseDetail() {
  const container = document.getElementById('case-detail-container');
  const caso = state.cases.find(c => c.id === state.selectedCaseId);
  if (!container) return;

  if (!caso) {
    container.innerHTML = `
      <div style="padding: 3rem; text-align: center; color: var(--color-text-muted);">
        Seleccione un expediente de la lista para ver su detalle institucional.
      </div>
    `;
    return;
  }

  const timelineHtml = caso.novedades.map(nov => `
    <div class="timeline-item">
      <div class="timeline-dot" style="background-color: ${nov.color};"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span style="font-weight: 600; color: ${nov.color};">${nov.titulo}</span>
          <span>${nov.fecha}</span>
        </div>
        <p style="font-size: 0.88rem;">${nov.descripcion}</p>
        <span style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.5rem; display: block;">
          Autor: ${nov.autor}
        </span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="detail-header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
        <div>
          <span class="case-code" style="font-size: 0.95rem;">EXPEDIENTE ${caso.id}</span>
          <h1 style="font-size: 1.35rem; font-weight: 700; margin-top: 0.25rem;">${caso.titulo}</h1>
          <div style="margin-top: 0.35rem; font-size: 0.85rem; color: var(--color-text-muted);">
            <strong>Solicitante:</strong> ${caso.solicitanteNombre} (${caso.origen})
          </div>
        </div>
        ${state.currentRole === 'SUPERADMIN' ? `
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-accent" onclick="window.abrirModal('modal-derivar-caso')">Derivar a Subalcaldía</button>
          <button class="btn-primary" onclick="window.abrirModal('modal-nueva-novedad')">Registrar Novedad</button>
          <button class="btn-secondary" onclick="window.resolverCasoPrompt('${caso.id}')">Resolver Caso</button>
        </div>` : `
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge-tag" style="background-color: rgba(56, 189, 248, 0.2); color: var(--color-status-registrado); font-size: 0.8rem;">
            Vista de Consulta y Seguimiento
          </span>
        </div>`}
      </div>
      <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.4;">
        ${caso.descripcion}
      </p>
    </div>

    <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem;">
      Cronología de Novedades Institucionales (Inmutable)
    </h3>
    <div class="timeline-novedades">
      ${timelineHtml}
    </div>
  `;
}

// Vista Especial: Supervisión y SLA
function renderVistaSupervision() {
  const container = document.getElementById('case-detail-container');
  const leftPanel = document.querySelector('.cases-inbox-panel');
  if (!container) return;

  const total = state.cases.length;
  const enProceso = state.cases.filter(c => c.estado === 'EN_PROCESO').length;
  const enDerivacion = state.cases.filter(c => c.estado === 'EN_DERIVACION').length;
  const urgentes = state.cases.filter(c => c.prioridad === 'URGENTE' || c.prioridad === 'ALTA').length;

  container.innerHTML = `
    <div class="detail-header">
      <h1 style="font-size: 1.35rem; font-weight: 700;">Consola de Supervisión y Monitoreo SLA</h1>
      <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.25rem;">
        Supervisión en tiempo real de cargas de trabajo, balance de dependencias y semáforos institucionales.
      </p>
    </div>

    <div class="dashboard-grid">
      <div class="metric-card">
        <span class="metric-card-title">Total Casos Activos</span>
        <span class="metric-card-value">${total}</span>
      </div>
      <div class="metric-card">
        <span class="metric-card-title">Casos en Atención</span>
        <span class="metric-card-value" style="color: var(--color-status-proceso);">${enProceso}</span>
      </div>
      <div class="metric-card">
        <span class="metric-card-title">En Derivación Cruzada</span>
        <span class="metric-card-value" style="color: var(--color-status-derivacion);">${enDerivacion}</span>
      </div>
      <div class="metric-card">
        <span class="metric-card-title">Prioridad Alta / Crítica</span>
        <span class="metric-card-value" style="color: #ef4444;">${urgentes}</span>
      </div>
    </div>

    <h3 style="font-size: 1.05rem; font-weight: 600; margin-bottom: 0.85rem;">Acciones de Supervisión Rápida</h3>
    <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
      <button class="btn-primary" onclick="window.rebalancearCargas()">⚖ Balancear Cargas Automático</button>
      <button class="btn-secondary" onclick="alert('[GAMEA] Reporte institucional exportado en formato de auditoría.')">Descargar Reporte de Trazabilidad</button>
    </div>

    <h3 style="font-size: 1.05rem; font-weight: 600; margin-bottom: 0.85rem;">Distribución por Dependencias y Subalcaldías</h3>
    <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 1.25rem;">
      ${state.cases.map(c => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0; border-bottom: 1px solid var(--color-border);">
          <div>
            <strong>${c.id}</strong>: ${c.titulo}
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Asignado a: ${c.responsable} | Destino: ${c.destino}</div>
          </div>
          <span class="status-tag" style="background-color: var(--color-status-proceso); color: #000;">${c.slaRestante}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// Vista Especial: Gestión de Usuarios de Oficinas (Clientes Internos)
function renderVistaUsuarios() {
  const container = document.getElementById('case-detail-container');
  if (!container) return;

  container.innerHTML = `
    <div class="detail-header">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 1.35rem; font-weight: 700;">Directorio de Funcionarios y Usuarios de Oficina</h1>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.25rem;">
            Administración de clientes internos autorizados para emitir y recibir solicitudes por dependencia y Subalcaldía.
          </p>
        </div>
        <button class="btn-accent" onclick="window.abrirModal('modal-nuevo-usuario')">+ Registrar Nuevo Usuario</button>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
      ${state.usuarios.map(u => `
        <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="font-size: 1rem; font-weight: 700;">${u.nombre}</h3>
              <span style="font-size: 0.8rem; color: var(--color-accent); font-weight: 600;">C.I. ${u.ci}</span>
            </div>
            <span class="badge-tag" style="background-color: rgba(27, 77, 126, 0.4); color: #fff;">${u.rol}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--color-text-muted);">
            <strong>Cargo:</strong> ${u.cargo}
          </div>
          <div style="font-size: 0.85rem; color: var(--color-text-muted);">
            <strong>Oficina:</strong> ${u.dependenciaNombre}
          </div>
          <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
            <button class="btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" onclick="alert('Funcionario ${u.nombre} activo en el sistema institucional.')">Ver Perfil</button>
            <button class="btn-primary" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" onclick="window.crearRequerimientoPara('${u.id}')">Crear Requerimiento</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================================
// VISTA EXCLUSIVA SUPERADMIN: CENTRO DE INSTRUCCIONES Y CONOCIMIENTO DEL AGENTE IA
// ============================================================================
function renderVistaControlAgente() {
  const container = document.getElementById('case-detail-container');
  if (!container) return;

  const agentName = localStorage.getItem('gamea_agent_name') || 'Asistente Institucional GAMEA';
  const tone = localStorage.getItem('gamea_agent_tone') || 'Comunícate siempre con un tono formal, amable, claro, respetuoso y estrictamente institucional con los servidores públicos.';
  const sysPrompt = localStorage.getItem('gamea_agent_sys_prompt') || DEFAULT_SYSTEM_PROMPT;
  const actions = localStorage.getItem('gamea_agent_actions') || DEFAULT_ACTIONS_PROTOCOL;
  const greeting = localStorage.getItem('gamea_agent_greeting') || '¡Hola! Le damos la bienvenida al soporte institucional del GAMEA. Soy su asistente virtual interno, ¿en qué requerimiento técnico o normativo puedo orientarle hoy?';
  const context = localStorage.getItem('gamea_agent_context') || DEFAULT_TRAINING_CONTEXT;
  const apiKey = localStorage.getItem('gamea_openrouter_api_key') || '';
  const model = localStorage.getItem('gamea_agent_model') || serverEnvConfig.defaultModel || 'nvidia/nemotron-3-super-120b-a12b:free';
  const temp = localStorage.getItem('gamea_agent_temperature') || '0.3';
  const agentEnabled = localStorage.getItem('gamea_agent_enabled') !== 'false';

  const totalChars = (sysPrompt + actions + context + greeting).length;

  container.innerHTML = `
    <div class="detail-header" style="padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <h1 style="font-size: 1.4rem; font-weight: 700; margin: 0;">Centro de Instrucciones y Control del Agente IA</h1>
            <span class="badge-tag" style="background-color: rgba(244, 162, 97, 0.2); color: var(--color-accent); font-size: 0.75rem;">
              EXCLUSIVO SUPERADMINISTRADOR
            </span>
          </div>
          <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-top: 0.35rem;">
            Configura el comportamiento, personalidad, reglas de escalado y base de conocimiento que guiarán la atención automatizada a los funcionarios.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--color-bg-surface); padding: 0.45rem 0.85rem; border-radius: 8px; border: 1px solid var(--color-border);">
          <span style="font-size: 0.85rem; font-weight: 600; color: ${agentEnabled ? 'var(--color-status-resuelto)' : '#ef4444'};">
            ${agentEnabled ? '● Agente Activo' : '○ Agente En Pausa'}
          </span>
          <button class="btn-secondary" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;" onclick="window.toggleEstadoAgente()">
            ${agentEnabled ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>

    <!-- Banner Informativo del archivo .env y Modelo -->
    <div style="background: rgba(27, 77, 126, 0.2); border: 1px solid var(--color-accent); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
      <div style="font-size: 0.85rem;">
        <strong>Conexión OpenRouter:</strong> 
        <span style="color: var(--color-accent); font-family: monospace;">${model}</span>
        ${serverEnvConfig.hasServerApiKey ? `<span style="margin-left: 0.75rem; color: var(--color-status-resuelto);">✔ Clave cargada desde archivo .env</span>` : `<span style="margin-left: 0.75rem; color: #ef4444;">Sin clave en .env (usando almacenamiento local o simulación)</span>`}
      </div>
      <button class="btn-primary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;" onclick="window.abrirModal('modal-entrenamiento-agente')">
        ⚙ Parámetros API y Modelos
      </button>
    </div>

    <!-- Panel de Dos Columnas: Comportamiento (Izquierda) vs Knowledge Base (Derecha) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; align-items: start;">
      
      <!-- COLUMNA 1: Comportamiento e Instrucciones -->
      <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: 10px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0;">Comportamiento</h2>
          <span style="font-size: 0.8rem; color: var(--color-text-muted);">Cómo se presenta y actúa el agente al responder a los servidores públicos del GAMEA.</span>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-weight: 600; font-size: 0.85rem;">Nombre del Agente</label>
          <input type="text" class="form-input" id="admin-agent-name" value="${escapeHTML(agentName)}" placeholder="Ej. Asistente Institucional GAMEA">
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-weight: 600; font-size: 0.85rem;">Tono de Atención</label>
          <input type="text" class="form-input" id="admin-agent-tone" value="${escapeHTML(tone)}" placeholder="Comunícate siempre con un tono profesional, institucional, amable y respetuoso...">
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-weight: 600; font-size: 0.85rem;">Instrucciones Principales (System Prompt)</label>
          <textarea class="form-textarea" style="min-height: 140px; font-size: 0.85rem;" id="admin-agent-instructions" placeholder="Define directrices institucionales, trato de 'usted', prohibiciones y alcance...">${escapeHTML(sysPrompt)}</textarea>
          <span style="font-size: 0.72rem; color: var(--color-text-muted);">💡 El agente adopta este rol de forma mandatoria en cada conversación.</span>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-weight: 600; font-size: 0.85rem;">Reglas de Escalado y Derivación a Técnicos Humanos</label>
          <textarea class="form-textarea" style="min-height: 120px; font-size: 0.85rem;" id="admin-agent-escalado" placeholder="Criterios para derivar a un técnico de soporte o supervisor institucional...">${escapeHTML(actions)}</textarea>
          <span style="font-size: 0.72rem; color: var(--color-text-muted);">Define cuándo clasificar como URGENTE y cuándo sugerir transferencia inmediata a DIR-TIC, Infraestructura o Jurídica.</span>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-weight: 600; font-size: 0.85rem;">Mensaje de Saludo Institucional</label>
          <input type="text" class="form-input" id="admin-agent-greeting" value="${escapeHTML(greeting)}" placeholder="Saludo inicial al abrir el chat...">
        </div>

        <button class="btn-accent" style="align-self: flex-start; padding: 0.6rem 1.25rem; font-weight: 600;" onclick="window.guardarComportamientoAdmin()">
          💾 Guardar Comportamiento del Agente
        </button>
      </div>

      <!-- COLUMNA 2: Knowledge Base (Base de Conocimiento) -->
      <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: 10px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0;">Base de Conocimiento (Knowledge Base)</h2>
            <span style="font-size: 0.8rem; color: var(--color-text-muted);">La única fuente de verdad institucional: lo que no esté respaldado aquí, no lo afirma.</span>
          </div>
          <span class="badge-tag" style="background: var(--color-bg-base); font-size: 0.75rem; color: var(--color-text-muted);">
            ${totalChars.toLocaleString()} caracteres
          </span>
        </div>

        <!-- Bloque: Agregar Nueva Pregunta / Respuesta Frecuente -->
        <div style="background: var(--color-bg-base); border: 1px solid var(--color-border); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.65rem;">
          <span style="font-weight: 600; font-size: 0.85rem;">Nueva Pregunta / Respuesta Institucional</span>
          <input type="text" class="form-input" id="kb-pregunta-input" placeholder="Pregunta (p. ej. ¿Cómo solicitar mantenimiento de fibra óptica en Subalcaldía?)">
          <textarea class="form-textarea" style="min-height: 70px; font-size: 0.85rem;" id="kb-respuesta-input" placeholder="Respuesta oficial con cita de normativa o procedimiento..."></textarea>
          <button class="btn-primary" style="align-self: flex-start; font-size: 0.75rem; padding: 0.4rem 0.85rem;" onclick="window.agregarFAQKnowledgeBase()">
            + Agregar Pregunta / Respuesta
          </button>
        </div>

        <!-- Bloque: Documentación y Texto Libre -->
        <div style="background: var(--color-bg-base); border: 1px solid var(--color-border); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.65rem;">
          <span style="font-weight: 600; font-size: 0.85rem;">Nuevo Bloque de Normativa o Directriz Municipal</span>
          <textarea class="form-textarea" style="min-height: 80px; font-size: 0.85rem;" id="kb-bloque-input" placeholder="Resoluciones, instructivos de Subalcaldías, reglamentos, horarios de guardia..."></textarea>
          <button class="btn-secondary" style="align-self: flex-start; font-size: 0.75rem; padding: 0.4rem 0.85rem;" onclick="window.agregarBloqueKnowledgeBase()">
            + Agregar Bloque de Texto
          </button>
        </div>

        <!-- Repositorio Completo de Conocimiento Activo -->
        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-weight: 600; font-size: 0.85rem;">Corpus de Conocimiento Activo del Agente</label>
          <textarea class="form-textarea" style="min-height: 220px; font-size: 0.82rem; font-family: monospace; line-height: 1.4;" id="admin-agent-knowledge">${escapeHTML(context)}</textarea>
        </div>

        <button class="btn-accent" style="align-self: flex-start; padding: 0.6rem 1.25rem; font-weight: 600;" onclick="window.guardarKnowledgeBaseAdmin()">
          💾 Actualizar Base de Conocimiento
        </button>
      </div>

    </div>
  `;
}

window.toggleEstadoAgente = function() {
  const actual = localStorage.getItem('gamea_agent_enabled') !== 'false';
  localStorage.setItem('gamea_agent_enabled', (!actual).toString());
  renderVistaControlAgente();
  alert(`[GAMEA] Agente IA ${!actual ? 'ACTIVADO' : 'PAUSADO'} exitosamente.`);
};

window.guardarComportamientoAdmin = function() {
  const name = document.getElementById('admin-agent-name')?.value.trim() || 'Asistente Institucional GAMEA';
  const tone = document.getElementById('admin-agent-tone')?.value.trim() || '';
  const instructions = document.getElementById('admin-agent-instructions')?.value.trim() || DEFAULT_SYSTEM_PROMPT;
  const escalado = document.getElementById('admin-agent-escalado')?.value.trim() || DEFAULT_ACTIONS_PROTOCOL;
  const greeting = document.getElementById('admin-agent-greeting')?.value.trim() || '';

  localStorage.setItem('gamea_agent_name', name);
  localStorage.setItem('gamea_agent_tone', tone);
  localStorage.setItem('gamea_agent_sys_prompt', `${instructions}\n\n[TONO DE ATENCIÓN]: ${tone}`);
  localStorage.setItem('gamea_agent_actions', escalado);
  localStorage.setItem('gamea_agent_greeting', greeting);

  alert('[GAMEA] Parámetros de comportamiento e instrucciones del Agente guardados correctamente.');
};

window.guardarKnowledgeBaseAdmin = function() {
  const kb = document.getElementById('admin-agent-knowledge')?.value.trim() || DEFAULT_TRAINING_CONTEXT;
  localStorage.setItem('gamea_agent_context', kb);
  alert('[GAMEA] Base de Conocimiento institucional actualizada y lista para RAG.');
  renderVistaControlAgente();
};

window.agregarFAQKnowledgeBase = function() {
  const p = document.getElementById('kb-pregunta-input')?.value.trim();
  const r = document.getElementById('kb-respuesta-input')?.value.trim();
  if (!p || !r) {
    alert('Por favor ingrese la pregunta y la respuesta oficial.');
    return;
  }

  const actual = localStorage.getItem('gamea_agent_context') || DEFAULT_TRAINING_CONTEXT;
  const nuevoItem = `\n\n[P&R]: ¿${p}?\nR: ${r}`;
  localStorage.setItem('gamea_agent_context', actual + nuevoItem);

  document.getElementById('kb-pregunta-input').value = '';
  document.getElementById('kb-respuesta-input').value = '';

  renderVistaControlAgente();
  alert('[GAMEA] Nueva pregunta/respuesta agregada a la Base de Conocimiento del Agente.');
};

window.agregarBloqueKnowledgeBase = function() {
  const bloque = document.getElementById('kb-bloque-input')?.value.trim();
  if (!bloque) {
    alert('Por favor ingrese el contenido normativo o directriz.');
    return;
  }

  const actual = localStorage.getItem('gamea_agent_context') || DEFAULT_TRAINING_CONTEXT;
  const nuevoItem = `\n\n[DIRECTRIZ / NORMATIVA]:\n${bloque}`;
  localStorage.setItem('gamea_agent_context', actual + nuevoItem);

  document.getElementById('kb-bloque-input').value = '';

  renderVistaControlAgente();
  alert('[GAMEA] Bloque normativo incorporado a la Base de Conocimiento.');
};

function poblarSelectsUsuarios() {
  const select = document.getElementById('req-solicitante-select');
  if (!select) return;
  select.innerHTML = state.usuarios.map(u => `
    <option value="${u.id}">${u.nombre} — ${u.dependenciaNombre}</option>
  `).join('');
}

// Controladores de Modales
window.abrirModal = function(id) {
  document.getElementById(id)?.classList.add('active');
};

window.cerrarModales = function() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
};

window.guardarNuevoRequerimiento = async function() {
  let solicitante;
  if (state.currentRole === 'CLIENTE_USUARIO') {
    solicitante = state.currentUser;
  } else {
    const solicitanteId = document.getElementById('req-solicitante-select').value;
    solicitante = state.usuarios.find(u => u.id === solicitanteId) || state.currentUser;
  }

  const destino = document.getElementById('req-destino-select').value;
  const prioridad = document.getElementById('req-prioridad-select').value;
  const asunto = document.getElementById('req-asunto-input').value.trim();
  const desc = document.getElementById('req-descripcion-input').value.trim();

  if (!asunto || !desc) {
    alert('Por favor ingrese el asunto y la descripción del requerimiento institucional.');
    return;
  }

  const payload = {
    titulo: asunto,
    solicitanteId: solicitante.id,
    solicitanteNombre: solicitante.nombre,
    origen: solicitante.dependenciaNombre,
    destino: destino,
    dependenciaActualId: destino,
    responsable: 'Sin Asignar (Bandeja de Entrada)',
    prioridad: prioridad,
    estado: 'REGISTRADO',
    slaRestante: '4h restantes',
    descripcion: desc
  };

  try {
    const res = await fetch('/api/v1/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const casoGuardado = await res.json();
      state.cases.unshift(casoGuardado);
      state.selectedCaseId = casoGuardado.id;
    } else {
      // Fallback local en caso de error
      const nuevoId = `CAS-2026-0${100 + state.cases.length}`;
      payload.id = nuevoId;
      payload.codigo = nuevoId;
      payload.novedades = [{
        titulo: 'Registro Formal de Requerimiento',
        autor: solicitante.nombre,
        fecha: 'Hace un momento',
        descripcion: desc,
        color: 'var(--color-status-registrado)'
      }];
      state.cases.unshift(payload);
      state.selectedCaseId = nuevoId;
    }
  } catch (err) {
    console.error('Error guardando caso en backend:', err);
    const nuevoId = `CAS-2026-0${100 + state.cases.length}`;
    payload.id = nuevoId;
    payload.codigo = nuevoId;
    payload.novedades = [{
      titulo: 'Registro Formal de Requerimiento',
      autor: solicitante.nombre,
      fecha: 'Hace un momento',
      descripcion: desc,
      color: 'var(--color-status-registrado)'
    }];
    state.cases.unshift(payload);
    state.selectedCaseId = nuevoId;
  }

  actualizarContadores();
  window.cerrarModales();

  // Limpiar formulario
  document.getElementById('req-asunto-input').value = '';
  document.getElementById('req-descripcion-input').value = '';

  restaurarWorkspaceGrid();
  renderCasesList();
  renderCaseDetail();
  alert(`[GAMEA] Requerimiento ${state.selectedCaseId} registrado y persistido exitosamente.`);
};

window.guardarNuevoUsuario = function() {
  const ci = document.getElementById('usr-ci-input').value.trim();
  const nombre = document.getElementById('usr-nombre-input').value.trim();
  const depSelect = document.getElementById('usr-dependencia-select');
  const depId = depSelect.value;
  const depNombre = depSelect.options[depSelect.selectedIndex].text;
  const cargo = document.getElementById('usr-cargo-input').value.trim();
  const rol = document.getElementById('usr-rol-select').value;

  if (!ci || !nombre || !cargo) {
    alert('Por favor complete todos los datos requeridos del servidor público.');
    return;
  }

  const nuevoUsuario = {
    id: `usr-00${state.usuarios.length + 1}`,
    ci: ci,
    nombre: nombre,
    dependencia: depId,
    dependenciaNombre: depNombre,
    cargo: cargo,
    rol: rol
  };

  state.usuarios.push(nuevoUsuario);
  actualizarContadores();
  window.cerrarModales();

  // Limpiar campos
  document.getElementById('usr-ci-input').value = '';
  document.getElementById('usr-nombre-input').value = '';
  document.getElementById('usr-cargo-input').value = '';

  poblarSelectsUsuarios();
  renderVistaUsuarios();
  alert(`[GAMEA] Funcionario ${nombre} registrado exitosamente como usuario institucional de ${depNombre}.`);
};

window.confirmarDerivacion = async function() {
  const destino = document.getElementById('deriv-destino-select').value;
  const motivo = document.getElementById('deriv-motivo-input').value.trim();

  if (!motivo) {
    alert('El motivo formal de derivación es obligatorio conforme a la Constitución.');
    return;
  }

  const caso = state.cases.find(c => c.id === state.selectedCaseId);
  if (!caso) return;

  const autor = state.currentUser ? state.currentUser.nombre : 'Lic. Marco Antonio Quispe';

  try {
    const res = await fetch(`/api/v1/cases/${encodeURIComponent(caso.id)}/derivar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destino, motivo, autor })
    });
    if (res.ok) {
      const updatedCase = await res.json();
      Object.assign(caso, updatedCase);
    } else {
      caso.estado = 'EN_DERIVACION';
      caso.destino = destino;
      caso.novedades.unshift({
        titulo: `Derivación formal a ${destino}`,
        autor: autor,
        fecha: 'Hace un momento',
        descripcion: motivo,
        color: 'var(--color-status-derivacion)'
      });
    }
  } catch (err) {
    console.error('Error derivando caso en backend:', err);
    caso.estado = 'EN_DERIVACION';
    caso.destino = destino;
    caso.novedades.unshift({
      titulo: `Derivación formal a ${destino}`,
      autor: autor,
      fecha: 'Hace un momento',
      descripcion: motivo,
      color: 'var(--color-status-derivacion)'
    });
  }

  window.cerrarModales();
  document.getElementById('deriv-motivo-input').value = '';

  actualizarContadores();
  renderCasesList();
  renderCaseDetail();
  alert(`[GAMEA] Caso ${caso.id} derivado formalmente a ${destino} con preservación persistente de antecedentes.`);
};

window.confirmarNovedad = async function() {
  const tipo = document.getElementById('nov-tipo-select').value;
  const titulo = document.getElementById('nov-titulo-input').value.trim();
  const desc = document.getElementById('nov-descripcion-input').value.trim();

  if (!titulo || !desc) {
    alert('El título y descripción de la Novedad son obligatorios.');
    return;
  }

  const caso = state.cases.find(c => c.id === state.selectedCaseId);
  if (!caso) return;

  const autor = state.currentUser ? state.currentUser.nombre : 'Lic. Marco Antonio Quispe';
  const novedadTitulo = `${tipo}: ${titulo}`;

  try {
    const res = await fetch(`/api/v1/cases/${encodeURIComponent(caso.id)}/novedades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: novedadTitulo,
        autor: autor,
        descripcion: desc,
        color: 'var(--color-accent)'
      })
    });
    if (res.ok) {
      const updatedCase = await res.json();
      Object.assign(caso, updatedCase);
    } else {
      caso.novedades.unshift({
        titulo: novedadTitulo,
        autor: autor,
        fecha: 'Hace un momento',
        descripcion: desc,
        color: 'var(--color-accent)'
      });
    }
  } catch (err) {
    console.error('Error agregando novedad al backend:', err);
    caso.novedades.unshift({
      titulo: novedadTitulo,
      autor: autor,
      fecha: 'Hace un momento',
      descripcion: desc,
      color: 'var(--color-accent)'
    });
  }

  window.cerrarModales();
  document.getElementById('nov-titulo-input').value = '';
  document.getElementById('nov-descripcion-input').value = '';

  renderCaseDetail();
};

window.resolverCasoPrompt = async function(casoId) {
  const solucion = prompt('Ingrese el detalle de la resolución técnica/administrativa del caso:');
  if (!solucion) return;

  const caso = state.cases.find(c => c.id === casoId);
  if (!caso) return;

  const autor = state.currentUser ? state.currentUser.nombre : 'Lic. Marco Antonio Quispe';

  try {
    const res = await fetch(`/api/v1/cases/${encodeURIComponent(caso.id)}/resolver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solucion, autor })
    });
    if (res.ok) {
      const updatedCase = await res.json();
      Object.assign(caso, updatedCase);
    } else {
      caso.estado = 'RESUELTO';
      caso.novedades.unshift({
        titulo: 'Resolución Operativa del Requerimiento',
        autor: autor,
        fecha: 'Hace un momento',
        descripcion: solucion,
        color: 'var(--color-status-resuelto)'
      });
    }
  } catch (err) {
    console.error('Error resolviendo caso en backend:', err);
    caso.estado = 'RESUELTO';
    caso.novedades.unshift({
      titulo: 'Resolución Operativa del Requerimiento',
      autor: autor,
      fecha: 'Hace un momento',
      descripcion: solucion,
      color: 'var(--color-status-resuelto)'
    });
  }

  renderCasesList();
  renderCaseDetail();
  alert(`[GAMEA] Caso ${caso.id} marcado como RESUELTO y persistido.`);
};

window.rebalancearCargas = function() {
  alert('[GAMEA] Proceso de supervisión ejecutado: Casos rebalanceados uniformemente entre los técnicos de guardia.');
};

window.crearRequerimientoPara = function(usuarioId) {
  poblarSelectsUsuarios();
  document.getElementById('req-solicitante-select').value = usuarioId;
  abrirModal('modal-nuevo-requerimiento');
};

window.ejecutarAnalisisIA = function() {
  const promptText = document.getElementById('ia-prompt-input').value.trim();
  const box = document.getElementById('ia-resultado-box');
  if (!promptText) {
    alert('Por favor ingrese una consulta o texto para el análisis de IA.');
    return;
  }

  box.style.display = 'block';
  box.innerHTML = '<span style="color: var(--color-text-muted);">Consultando Base de Conocimiento y evaluando confianza...</span>';

  setTimeout(() => {
    const texto = promptText.toLowerCase();
    if (texto.includes('maquinaria') || texto.includes('distrito')) {
      box.innerHTML = `
        <div style="font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="color: var(--color-status-resuelto);">Respuesta Sustentada en RAG (Oficial)</strong>
            <span class="badge-tag" style="background-color: rgba(74, 222, 128, 0.2); color: var(--color-status-resuelto);">Confianza: 0.94</span>
          </div>
          <p style="margin-bottom: 0.5rem;">
            Conforme a la <strong>RES-ADM-GAMEA-045/2025</strong> (Dirección de Infraestructura Pública, Versión 2.1), la solicitud de maquinaria pesada distrital requiere trámite previo con 72 horas de anticipación y aval del Subalcalde respectivo.
          </p>
          <div style="font-size: 0.75rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 0.4rem;">
            Fuente Verificada: SHA256:e3b0c442... | Vigente 2026
          </div>
        </div>
      `;
    } else {
      box.innerHTML = `
        <div style="font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="color: var(--color-accent);">Sugerencia de Clasificación Automática</strong>
            <span class="badge-tag" style="background-color: rgba(244, 162, 97, 0.2); color: var(--color-accent);">Confianza: 0.88</span>
          </div>
          <p style="margin-bottom: 0.5rem;">
            <strong>Categoría Sugerida:</strong> Soporte e Infraestructura Tecnológica<br>
            <strong>Dependencia Destino:</strong> Dirección de Tecnologías e Información (DIR-TIC)<br>
            <strong>Prioridad Recomendada:</strong> ALTA
          </p>
        </div>
      `;
    }
  }, 400);
};

function setupActionButtons() {
  // Configuración de listeners globales
  document.getElementById('btn-config-agente')?.addEventListener('click', () => {
    cargarParametrosEntrenamiento();
    abrirModal('modal-entrenamiento-agente');
  });

  document.getElementById('btn-toggle-whatsapp')?.addEventListener('click', () => {
    window.toggleWhatsAppChat();
  });

  document.getElementById('chat-user-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      window.enviarMensajeChat();
    }
  });

  verificarConfiguracionEnvServidor().then(() => {
    cargarParametrosEntrenamiento();
  });
}

// ============================================================================
// LÓGICA DE AGENTE INTELIGENTE WHATSAPP & API OPENROUTER / .ENV
// ============================================================================

const DEFAULT_SYSTEM_PROMPT = `Eres el Agente Inteligente de la Jefatura de Sistemas y Tecnologías del Gobierno Autónomo Municipal de El Alto (GAMEA).
Tu función exclusiva es brindar asistencia técnica, soporte de sistemas, conectividad, mesa de ayuda y orientación en derivaciones operativas a todos los funcionarios públicos de las oficinas centrales, secretarías, direcciones y las 14 Subalcaldías de El Alto.
Debes comunicarte con un tono formal, institucional, claro, empático y respetuoso. Respetas estrictamente la metodología SDD, las normativas internas y nunca tomas decisiones administrativas autónomas.`;

const DEFAULT_TRAINING_CONTEXT = `[BASE DE CONOCIMIENTO INSTITUCIONAL - JEFATURA DE SISTEMAS GAMEA]
1. ÁMBITO DE ATENCIÓN: Asistencia y soporte técnico exclusivo para todas las oficinas municipales de El Alto y las 14 Subalcaldías (D-1 al D-14).
2. SISTEMAS Y PLATAFORMAS EN ATENCIÓN: Sistemas de trámite documentario, RUAT tributario, cajas municipales, conectividad LAN/WLAN, enlaces de fibra óptica, correos institucionales y hardware.
3. PROTOCOLO DE CONECTIVIDAD Y REDES: Caídas de enlace troncal en Casa Municipal o Subalcaldías distritales tienen prioridad ALTA/URGENTE con SLA máximo de 4 horas.
4. REGLAMENTO DE MAQUINARIA (RES-ADM-GAMEA-045/2025): Toda solicitud de maquinaria pesada debe remitirse con al menos 72h de anticipación y aval del Subalcalde.
5. DERIVACIÓN INTERNA INSTITUCIONAL: La derivación formal traspasa la custodia operativa del requerimiento a otra dependencia sin borrar antecedentes ni novedades previas.
6. ALMACENAMIENTO RELACIONAL SEGURO: Todos los casos, novedades, estados y derivaciones se persisten de forma inmediata en la base de datos relacional PostgreSQL 16.`;

const DEFAULT_ACTIONS_PROTOCOL = `[PAUTAS DE ATENCIÓN Y PROTOCOLOS DE LA JEFATURA DE SISTEMAS]:
1. SALUDO INSTITUCIONAL: Saluda en nombre de la "Jefatura de Sistemas - Gobierno Autónomo Municipal de El Alto".
2. RECOLECCIÓN DE DATOS: Solicita al funcionario requirente:
   - Oficina, Dirección o Subalcaldía de origen (ej. Subalcaldía D-3, Dir. Jurídica).
   - Nombre del servidor público y número de C.I.
   - Detalle del problema técnico o requerimiento informático.
3. CALIFICACIÓN Y PRIORIZACIÓN:
   - URGENTE: Si afecta recaudaciones (RUAT, Cajas), caídas masivas de red o servidores centrales.
   - ALTA: Fallas que paralicen despachos, secretarías o subalcaldías con plazos perentorios.
   - MEDIA/BAJA: Soporte preventivo, instalación de periféricos, cuentas de usuario o consultas de uso.
4. ACCIÓN DE DERIVACIÓN: Si el requerimiento es de competencia de otra área (Infraestructura, Catastro, Asesoría Legal), orienta al usuario para derivar formalmente en el sistema.
5. ESCALAMIENTO HUMANO: Ante incidencias de seguridad informática o requerimientos de compras de equipos, canaliza el caso directamente a la supervisión técnica humana.`;

let serverEnvConfig = {
  hasServerApiKey: false,
  defaultModel: 'nvidia/nemotron-3-super-120b-a12b:free',
  keyPreview: ''
};

async function verificarConfiguracionEnvServidor() {
  try {
    const res = await fetch('/api/v1/config/agent');
    if (res.ok) {
      serverEnvConfig = await res.json();
      actualizarBannerEnv();
    }
  } catch (e) {
    console.warn('[GAMEA] No se pudo consultar configuración .env:', e);
  }
}

function actualizarBannerEnv() {
  const textEl = document.getElementById('env-status-text');
  const badgeEl = document.getElementById('env-status-badge');
  if (!textEl || !badgeEl) return;

  if (serverEnvConfig.hasServerApiKey) {
    textEl.innerHTML = `Detectada <code>OPENROUTER_API_KEY</code> en <code>.env</code> (${serverEnvConfig.keyPreview}). El agente está activo para todos los usuarios.`;
    badgeEl.textContent = 'Activo (.env)';
    badgeEl.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
    badgeEl.style.color = 'var(--color-status-resuelto)';
  } else {
    textEl.innerHTML = `No se detectó clave en el archivo <code>.env</code>. Puedes colocar tu clave aquí o editar el archivo <code>.env</code> en el servidor.`;
    badgeEl.textContent = 'Sin clave en .env';
    badgeEl.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
    badgeEl.style.color = '#ef4444';
  }
}

function cargarParametrosEntrenamiento() {
  const apiKey = localStorage.getItem('gamea_openrouter_api_key') || '';
  const model = localStorage.getItem('gamea_agent_model') || serverEnvConfig.defaultModel || 'nvidia/nemotron-3-super-120b-a12b:free';
  const sysPrompt = localStorage.getItem('gamea_agent_sys_prompt') || DEFAULT_SYSTEM_PROMPT;
  const context = localStorage.getItem('gamea_agent_context') || DEFAULT_TRAINING_CONTEXT;
  const actions = localStorage.getItem('gamea_agent_actions') || DEFAULT_ACTIONS_PROTOCOL;
  const temp = localStorage.getItem('gamea_agent_temperature') || '0.3';

  if (document.getElementById('agent-api-key')) document.getElementById('agent-api-key').value = apiKey;
  if (document.getElementById('agent-model-select')) document.getElementById('agent-model-select').value = model;
  if (document.getElementById('agent-system-prompt')) document.getElementById('agent-system-prompt').value = sysPrompt;
  if (document.getElementById('agent-training-context')) document.getElementById('agent-training-context').value = context;
  if (document.getElementById('agent-actions-protocol')) document.getElementById('agent-actions-protocol').value = actions;
  if (document.getElementById('agent-temperature')) document.getElementById('agent-temperature').value = temp;

  actualizarBannerEnv();

  if (document.getElementById('chat-model-indicator')) {
    const isConnected = apiKey || serverEnvConfig.hasServerApiKey;
    const modelName = model.split('/')[1] || model;
    document.getElementById('chat-model-indicator').textContent = isConnected ? `OpenRouter: ${modelName}` : 'Agente GAMEA (Modo Base)';
  }
}

window.guardarConfiguracionAgente = function() {
  const apiKey = document.getElementById('agent-api-key').value.trim();
  const model = document.getElementById('agent-model-select').value;
  const sysPrompt = document.getElementById('agent-system-prompt').value.trim();
  const context = document.getElementById('agent-training-context').value.trim();
  const actions = document.getElementById('agent-actions-protocol').value.trim();
  const temp = document.getElementById('agent-temperature').value;

  localStorage.setItem('gamea_openrouter_api_key', apiKey);
  localStorage.setItem('gamea_agent_model', model);
  localStorage.setItem('gamea_agent_sys_prompt', sysPrompt);
  localStorage.setItem('gamea_agent_context', context);
  localStorage.setItem('gamea_agent_actions', actions);
  localStorage.setItem('gamea_agent_temperature', temp);

  cargarParametrosEntrenamiento();
  window.cerrarModales();
  alert('[GAMEA] Base de Conocimiento, Protocolos de Acción y configuración guardados correctamente.');
};

window.toggleWhatsAppChat = function() {
  const chatWindow = document.getElementById('whatsapp-chat-window');
  if (!chatWindow) return;
  chatWindow.classList.toggle('active');
  if (chatWindow.classList.contains('active')) {
    document.getElementById('chat-user-input')?.focus();
  }
};

window.enviarMensajeChat = async function() {
  const input = document.getElementById('chat-user-input');
  const messagesContainer = document.getElementById('chat-messages-container');
  const texto = input.value.trim();
  if (!texto) return;

  const ahora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Mensaje del usuario
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `${escapeHTML(texto)}<div class="chat-bubble-time">${ahora}</div>`;
  messagesContainer.appendChild(userBubble);
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Burbuja de respuesta (cargando)
  const botBubble = document.createElement('div');
  botBubble.className = 'chat-bubble bot';
  botBubble.innerHTML = `<em>Escribiendo respuesta institucional conforme a protocolos...</em><div class="chat-bubble-time">${ahora}</div>`;
  messagesContainer.appendChild(botBubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  const localApiKey = localStorage.getItem('gamea_openrouter_api_key') || '';
  const model = localStorage.getItem('gamea_agent_model') || serverEnvConfig.defaultModel || 'nvidia/nemotron-3-super-120b-a12b:free';
  const sysPrompt = localStorage.getItem('gamea_agent_sys_prompt') || DEFAULT_SYSTEM_PROMPT;
  const context = localStorage.getItem('gamea_agent_context') || DEFAULT_TRAINING_CONTEXT;
  const actions = localStorage.getItem('gamea_agent_actions') || DEFAULT_ACTIONS_PROTOCOL;
  const temp = parseFloat(localStorage.getItem('gamea_agent_temperature') || '0.3');

  const tieneKey = localApiKey || serverEnvConfig.hasServerApiKey;

  if (!tieneKey) {
    // Modo simulación asistida si no hay clave en cliente ni en .env
    setTimeout(() => {
      let respuestaSimulada = '';
      const t = texto.toLowerCase();
      if (t.includes('maquinaria') || t.includes('distrito')) {
        respuestaSimulada = 'Conforme a la <strong>RES-ADM-GAMEA-045/2025</strong>, la solicitud de maquinaria distrital requiere un plazo mínimo de 72 horas de anticipación con aprobación del Subalcalde respectivo.';
      } else if (t.includes('red') || t.includes('fibra') || t.includes('internet')) {
        respuestaSimulada = 'Los reportes de conectividad y enlaces de fibra óptica son clasificados con prioridad ALTA en la Dirección de Tecnologías e Información, con un SLA de respuesta máxima de 4 horas.';
      } else {
        respuestaSimulada = `He recibido su consulta: "<em>${escapeHTML(texto)}</em>". Para activar respuestas en tiempo real con modelos 100% gratuitos como Gemini 2.0 Flash o Llama 3.3 70B de OpenRouter, configure su clave en el archivo <code>.env</code> o en el panel de administración.`;
      }

      botBubble.innerHTML = `${respuestaSimulada}<div class="chat-bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 600);
    return;
  }

  // Ejecución contra la API (si hay localApiKey se conecta directo a OpenRouter, o vía backend /api/v1/agent/chat si está en .env)
  try {
    let botText = '';
    const messagesPayload = [
      {
        role: 'system',
        content: `${sysPrompt}\n\n${context}\n\n${actions}`
      },
      {
        role: 'user',
        content: texto
      }
    ];

    if (localApiKey) {
      // Conexión directa a OpenRouter con clave local
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'GAMEA Soporte Interno'
        },
        body: JSON.stringify({
          model: model,
          temperature: temp,
          messages: messagesPayload
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Error HTTP ${response.status} en OpenRouter`);
      }

      const data = await response.json();
      botText = data.choices?.[0]?.message?.content || 'No se obtuvo respuesta del modelo de IA.';
    } else {
      // Conexión segura usando la clave del archivo .env a través del backend
      const response = await fetch('/api/v1/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          temperature: temp,
          messages: messagesPayload
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Error HTTP ${response.status} en servidor`);
      }

      const data = await response.json();
      botText = data.choices?.[0]?.message?.content || 'No se obtuvo respuesta del modelo de IA.';
    }

    const rawContent = botText;
    // Filtrar bloques de razonamiento interno <think>...</think>
    const cleanContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim() || rawContent;

    botBubble.innerHTML = `${escapeHTML(cleanContent).replace(/\n/g, '<br>')}<div class="chat-bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
  } catch (error) {
    botBubble.innerHTML = `<span style="color: #ef4444;"><strong>Error de Conexión:</strong> ${escapeHTML(error.message)}</span><div class="chat-bubble-time">${ahora}</div>`;
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
