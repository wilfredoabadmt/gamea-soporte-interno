// Estado y almacenamiento en memoria para el frontend interactivo
const state = {
  activeTab: 'personal',
  selectedCaseId: 'CAS-2026-0084',
  cases: [
    {
      id: 'CAS-2026-0084',
      titulo: 'Falla de enlace de fibra óptica y red interna en piso 3',
      origen: 'Dir. Asesoría Jurídica',
      destino: 'Dir. Tecnologías e Información',
      prioridad: 'ALTA',
      estado: 'EN_PROCESO',
      slaRestante: '2h restantes',
      descripcion: 'El personal técnico de la Dirección Jurídica reporta cortes intermitentes en la base de datos central. Se requiere verificación in situ del rack de comunicaciones y empalmes.',
      novedades: [
        {
          titulo: 'Inicio de Atención Técnica',
          autor: 'Marco Antonio Quispe (Técnico de Redes)',
          fecha: 'Hoy, 09:15 AM',
          descripcion: 'Técnico ha iniciado pruebas de reflectometría en el switch principal.',
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
      titulo: 'Mantenimiento de computadoras y catastro distrital',
      origen: 'Despacho Municipal',
      destino: 'Subalcaldía Distrito 3',
      prioridad: 'MEDIA',
      estado: 'EN_DERIVACION',
      slaRestante: '5h restantes',
      descripcion: 'Solicitud de revisión preventiva para 8 terminales que procesan catastros vecinales en la Subalcaldía del Distrito 3.',
      novedades: [
        {
          titulo: 'Derivación Inter-Oficinas',
          autor: 'Despacho Municipal',
          fecha: 'Hoy, 07:45 AM',
          descripcion: 'Se deriva expediente a la Subalcaldía del Distrito 3 para inspección territorial.',
          color: 'var(--color-status-derivacion)'
        }
      ]
    }
  ]
};

// Inicialización de controladores de interfaz
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  renderCasesList();
  renderCaseDetail();
  setupActionButtons();
});

function setupNavigation() {
  const navItems = [
    { id: 'btn-inbox-personal', tab: 'personal', title: 'Mi Bandeja Personal' },
    { id: 'btn-inbox-unidad', tab: 'unidad', title: 'Bandeja de Unidad (DIR-TIC)' },
    { id: 'btn-inbox-subalcaldia', tab: 'subalcaldia', title: 'Subalcaldías de El Alto (14 Distritos)' },
    { id: 'btn-inbox-supervision', tab: 'supervision', title: 'Consola de Supervisión y Monitoreo SLA' }
  ];

  navItems.forEach(item => {
    const el = document.getElementById(item.id);
    if (!el) return;
    el.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      state.activeTab = item.tab;
      document.getElementById('inbox-title').textContent = item.title;
      renderCasesList();
    });
  });
}

function renderCasesList() {
  const container = document.getElementById('cases-list-container');
  if (!container) return;

  container.innerHTML = state.cases.map(caso => {
    const isSelected = caso.id === state.selectedCaseId ? 'selected' : '';
    const statusColor = caso.estado === 'EN_PROCESO' 
      ? 'var(--color-status-proceso)' 
      : 'var(--color-status-derivacion)';
    const statusTextColor = caso.estado === 'EN_PROCESO' ? '#000' : '#fff';

    return `
      <div class="case-card ${isSelected}" onclick="window.selectCase('${caso.id}')">
        <div class="case-card-header">
          <span class="case-code">${caso.id}</span>
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
  if (!container || !caso) return;

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
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-accent" onclick="window.modalDerivar()">Derivar a Subalcaldía</button>
          <button class="btn-primary" onclick="window.modalNovedad()">Registrar Novedad</button>
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

function setupActionButtons() {
  window.modalDerivar = function() {
    const destino = prompt('Seleccione Subalcaldía de Destino (D-1 a D-14):', 'Subalcaldía Distrito 8 (Senkata)');
    if (!destino) return;
    const motivo = prompt('Ingrese el motivo formal de la derivación inter-oficinas:', 'Inspección técnica de infraestructura distrital.');
    if (!motivo) return;

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

    renderCasesList();
    renderCaseDetail();
    alert(`[GAMEA] Caso ${caso.id} derivado exitosamente a ${destino} con registro forense.`);
  };

  window.modalNovedad = function() {
    const desc = prompt('Describa la Novedad Institucional a registrar:');
    if (!desc) return;

    const caso = state.cases.find(c => c.id === state.selectedCaseId);
    if (!caso) return;

    caso.novedades.unshift({
      titulo: 'Avance Operativo Registrado',
      autor: 'Lic. Marco Antonio Quispe',
      fecha: 'Hace un momento',
      descripcion: desc,
      color: 'var(--color-accent)'
    });

    renderCaseDetail();
  };
}
