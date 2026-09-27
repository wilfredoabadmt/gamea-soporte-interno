// ============================================================================
// GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO — GAMEA
// Plataforma Interna de Gestión, Soporte y Casos
// Controlador Front-End Modular (app.js)
// ============================================================================

const state = {
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

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  actualizarContadores();
  renderCasesList();
  renderCaseDetail();
  setupActionButtons();
  poblarSelectsUsuarios();
});

function actualizarContadores() {
  document.getElementById('count-personal').textContent = state.cases.filter(c => c.dependenciaActualId === 'DIR-TECNOLOGIAS-INF').length;
  document.getElementById('count-unidad').textContent = state.cases.length;
  document.getElementById('count-subalcaldia').textContent = state.cases.filter(c => c.distrito !== null).length;
  document.getElementById('count-supervision').textContent = state.cases.filter(c => c.prioridad === 'URGENTE' || c.prioridad === 'ALTA').length;
  document.getElementById('count-usuarios').textContent = state.usuarios.length;
}

function setupNavigation() {
  const navItems = [
    { id: 'btn-inbox-personal', tab: 'personal', title: 'Mi Bandeja Personal (DIR-TIC)' },
    { id: 'btn-inbox-unidad', tab: 'unidad', title: 'Bandeja de Unidad — Casos Consolidados' },
    { id: 'btn-inbox-subalcaldia', tab: 'subalcaldia', title: 'Subalcaldías de El Alto (14 Distritos)' },
    { id: 'btn-inbox-supervision', tab: 'supervision', title: 'Consola de Supervisión y Monitoreo SLA' },
    { id: 'btn-usuarios-oficinas', tab: 'usuarios', title: 'Gestión de Funcionarios y Usuarios de Oficina' }
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

  if (state.activeTab === 'personal') {
    casosFiltrados = casosFiltrados.filter(c => c.dependenciaActualId === 'DIR-TECNOLOGIAS-INF');
  } else if (state.activeTab === 'subalcaldia') {
    casosFiltrados = casosFiltrados.filter(c => c.distrito !== null);
  }

  if (state.distritoFiltro !== null) {
    casosFiltrados = casosFiltrados.filter(c => c.distrito === state.distritoFiltro);
  }

  if (casosFiltrados.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem 1rem; text-align: center; color: var(--color-text-muted); font-size: 0.9rem;">
        No hay requerimientos en esta bandeja.
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
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-accent" onclick="window.abrirModal('modal-derivar-caso')">Derivar a Subalcaldía</button>
          <button class="btn-primary" onclick="window.abrirModal('modal-nueva-novedad')">Registrar Novedad</button>
          <button class="btn-secondary" onclick="window.resolverCasoPrompt('${caso.id}')">Resolver Caso</button>
        </div>
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

window.guardarNuevoRequerimiento = function() {
  const solicitanteId = document.getElementById('req-solicitante-select').value;
  const destino = document.getElementById('req-destino-select').value;
  const prioridad = document.getElementById('req-prioridad-select').value;
  const asunto = document.getElementById('req-asunto-input').value.trim();
  const desc = document.getElementById('req-descripcion-input').value.trim();

  if (!asunto || !desc) {
    alert('Por favor ingrese el asunto y la descripción del requerimiento institucional.');
    return;
  }

  const solicitante = state.usuarios.find(u => u.id === solicitanteId);
  const nuevoId = `CAS-2026-0${100 + state.cases.length}`;

  const nuevoCaso = {
    id: nuevoId,
    codigo: nuevoId,
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
    distrito: destino.includes('SUBALCALDIA') ? parseInt(destino.replace('SUBALCALDIA-D', ''), 10) : null,
    descripcion: desc,
    novedades: [
      {
        titulo: 'Registro Formal de Requerimiento',
        autor: solicitante.nombre,
        fecha: 'Hace un momento',
        descripcion: desc,
        color: 'var(--color-status-registrado)'
      }
    ]
  };

  state.cases.unshift(nuevoCaso);
  state.selectedCaseId = nuevoId;
  actualizarContadores();
  window.cerrarModales();

  // Limpiar formulario
  document.getElementById('req-asunto-input').value = '';
  document.getElementById('req-descripcion-input').value = '';

  restaurarWorkspaceGrid();
  renderCasesList();
  renderCaseDetail();
  alert(`[GAMEA] Requerimiento ${nuevoId} registrado formalmente en el sistema institucional.`);
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

window.confirmarDerivacion = function() {
  const destino = document.getElementById('deriv-destino-select').value;
  const motivo = document.getElementById('deriv-motivo-input').value.trim();

  if (!motivo) {
    alert('El motivo formal de derivación es obligatorio conforme a la Constitución.');
    return;
  }

  const caso = state.cases.find(c => c.id === state.selectedCaseId);
  if (!caso) return;

  caso.estado = 'EN_DERIVACION';
  caso.destino = destino;
  caso.novedades.unshift({
    titulo: `Derivación formal a ${destino}`,
    autor: 'Lic. Marco Antonio Quispe',
    fecha: 'Hace un momento',
    descripcion: motivo,
    color: 'var(--color-status-derivacion)'
  });

  window.cerrarModales();
  document.getElementById('deriv-motivo-input').value = '';

  actualizarContadores();
  renderCasesList();
  renderCaseDetail();
  alert(`[GAMEA] Caso ${caso.id} derivado formalmente a ${destino} con preservación de antecedentes.`);
};

window.confirmarNovedad = function() {
  const tipo = document.getElementById('nov-tipo-select').value;
  const titulo = document.getElementById('nov-titulo-input').value.trim();
  const desc = document.getElementById('nov-descripcion-input').value.trim();

  if (!titulo || !desc) {
    alert('El título y descripción de la Novedad son obligatorios.');
    return;
  }

  const caso = state.cases.find(c => c.id === state.selectedCaseId);
  if (!caso) return;

  caso.novedades.unshift({
    titulo: `${tipo}: ${titulo}`,
    autor: 'Lic. Marco Antonio Quispe',
    fecha: 'Hace un momento',
    descripcion: desc,
    color: 'var(--color-accent)'
  });

  window.cerrarModales();
  document.getElementById('nov-titulo-input').value = '';
  document.getElementById('nov-descripcion-input').value = '';

  renderCaseDetail();
};

window.resolverCasoPrompt = function(casoId) {
  const solucion = prompt('Ingrese el detalle de la resolución técnica/administrativa del caso:');
  if (!solucion) return;

  const caso = state.cases.find(c => c.id === casoId);
  if (!caso) return;

  caso.estado = 'RESUELTO';
  caso.novedades.unshift({
    titulo: 'Resolución Operativa del Requerimiento',
    autor: 'Lic. Marco Antonio Quispe',
    fecha: 'Hace un momento',
    descripcion: solucion,
    color: 'var(--color-status-resuelto)'
  });

  renderCasesList();
  renderCaseDetail();
  alert(`[GAMEA] Caso ${caso.id} marcado como RESUELTO.`);
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

  cargarParametrosEntrenamiento();
}

// ============================================================================
// LÓGICA DE AGENTE INTELIGENTE WHATSAPP & API OPENROUTER
// ============================================================================

const DEFAULT_SYSTEM_PROMPT = `Eres el Agente Inteligente de Soporte Interno del Gobierno Autónomo Municipal de El Alto (GAMEA).
Tu función es orientar a los funcionarios municipales en procedimientos administrativos, normativas internas, soporte técnico de sistemas, derivaciones entre unidades y seguimiento de casos.
Debes responder con tono formal, institucional, claro y respetuoso. Si no tienes certeza de un procedimiento o normativa, debes recomendar la derivación o elevación a revisión humana conforme a la Constitución del GAMEA.`;

const DEFAULT_TRAINING_CONTEXT = `[BASE DE CONOCIMIENTO INSTITUCIONAL GAMEA]
1. REGLAMENTO DE MAQUINARIA (RES-ADM-GAMEA-045/2025): Toda solicitud distrital de maquinaria pesada debe ser solicitada con al menos 72 horas de anticipación con visto bueno del Subalcalde.
2. SOPORTE DE REDES Y CONECTIVIDAD: Los cortes de fibra óptica y red troncal en Casa Municipal o Subalcaldías tienen prioridad ALTA con SLA máximo de respuesta de 4 horas.
3. DERIVACIÓN INTERNA: La derivación traspasa la custodia formal del caso hacia otra oficina o Subalcaldía sin borrar jamás el historial de novedades previas.
4. LAS 14 SUBALCALDÍAS: El Alto cuenta con 14 Distritos Municipales (D-1 a D-14), con bandejas operativas autónomas pero coordinadas.
5. PRINCIPIO DE RESPONSABILIDAD: La IA no aprueba gastos ni emite sanciones administrativas; asiste y asesora a los servidores públicos.`;

function cargarParametrosEntrenamiento() {
  const apiKey = localStorage.getItem('gamea_openrouter_api_key') || '';
  const model = localStorage.getItem('gamea_agent_model') || 'anthropic/claude-3.5-sonnet';
  const sysPrompt = localStorage.getItem('gamea_agent_sys_prompt') || DEFAULT_SYSTEM_PROMPT;
  const context = localStorage.getItem('gamea_agent_context') || DEFAULT_TRAINING_CONTEXT;
  const temp = localStorage.getItem('gamea_agent_temperature') || '0.3';

  if (document.getElementById('agent-api-key')) document.getElementById('agent-api-key').value = apiKey;
  if (document.getElementById('agent-model-select')) document.getElementById('agent-model-select').value = model;
  if (document.getElementById('agent-system-prompt')) document.getElementById('agent-system-prompt').value = sysPrompt;
  if (document.getElementById('agent-training-context')) document.getElementById('agent-training-context').value = context;
  if (document.getElementById('agent-temperature')) document.getElementById('agent-temperature').value = temp;

  if (document.getElementById('chat-model-indicator')) {
    document.getElementById('chat-model-indicator').textContent = apiKey ? `OpenRouter: ${model.split('/')[1] || model}` : 'Agente GAMEA (Modo Local)';
  }
}

window.guardarConfiguracionAgente = function() {
  const apiKey = document.getElementById('agent-api-key').value.trim();
  const model = document.getElementById('agent-model-select').value;
  const sysPrompt = document.getElementById('agent-system-prompt').value.trim();
  const context = document.getElementById('agent-training-context').value.trim();
  const temp = document.getElementById('agent-temperature').value;

  localStorage.setItem('gamea_openrouter_api_key', apiKey);
  localStorage.setItem('gamea_agent_model', model);
  localStorage.setItem('gamea_agent_sys_prompt', sysPrompt);
  localStorage.setItem('gamea_agent_context', context);
  localStorage.setItem('gamea_agent_temperature', temp);

  cargarParametrosEntrenamiento();
  window.cerrarModales();
  alert('[GAMEA] Parámetros de entrenamiento y credenciales de OpenRouter guardados correctamente.');
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
  botBubble.innerHTML = `<em>Escribiendo respuesta institucional...</em><div class="chat-bubble-time">${ahora}</div>`;
  messagesContainer.appendChild(botBubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  const apiKey = localStorage.getItem('gamea_openrouter_api_key') || '';
  const model = localStorage.getItem('gamea_agent_model') || 'anthropic/claude-3.5-sonnet';
  const sysPrompt = localStorage.getItem('gamea_agent_sys_prompt') || DEFAULT_SYSTEM_PROMPT;
  const context = localStorage.getItem('gamea_agent_context') || DEFAULT_TRAINING_CONTEXT;
  const temp = parseFloat(localStorage.getItem('gamea_agent_temperature') || '0.3');

  if (!apiKey) {
    // Modo simulación asistida si el usuario aún no configuró su API Key de OpenRouter
    setTimeout(() => {
      let respuestaSimulada = '';
      const t = texto.toLowerCase();
      if (t.includes('maquinaria') || t.includes('distrito')) {
        respuestaSimulada = 'Conforme a la <strong>RES-ADM-GAMEA-045/2025</strong>, la solicitud de maquinaria distrital requiere un plazo mínimo de 72 horas de anticipación con aprobación del Subalcalde respectivo.';
      } else if (t.includes('red') || t.includes('fibra') || t.includes('internet')) {
        respuestaSimulada = 'Los reportes de conectividad y enlaces de fibra óptica son clasificados con prioridad ALTA en la Dirección de Tecnologías e Información, con un SLA de respuesta máxima de 4 horas.';
      } else {
        respuestaSimulada = `He recibido su consulta: "<em>${escapeHTML(texto)}</em>". Para activar respuestas en tiempo real con modelos como Claude 3.5 Sonnet, GPT-4o o Gemini 2.0 Flash, configure su clave en el icono ⚙ del chat.`;
      }

      botBubble.innerHTML = `${respuestaSimulada}<div class="chat-bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 600);
    return;
  }

  // LLAMADA REAL A LA API DE OPENROUTER
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'GAMEA Soporte Interno'
      },
      body: JSON.stringify({
        model: model,
        temperature: temp,
        messages: [
          {
            role: 'system',
            content: `${sysPrompt}\n\n[CONTEXTO DE ENTRENAMIENTO Y DIRECTRICES INSTITUCIONALES]:\n${context}`
          },
          {
            role: 'user',
            content: texto
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Error HTTP ${response.status} en OpenRouter`);
    }

    const data = await response.json();
    const botText = data.choices?.[0]?.message?.content || 'No se obtuvo respuesta del modelo de IA.';

    botBubble.innerHTML = `${escapeHTML(botText).replace(/\n/g, '<br>')}<div class="chat-bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
  } catch (error) {
    botBubble.innerHTML = `<span style="color: #ef4444;"><strong>Error OpenRouter:</strong> ${escapeHTML(error.message)}</span><div class="chat-bubble-time">${ahora}</div>`;
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
