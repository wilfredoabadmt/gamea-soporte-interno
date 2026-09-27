import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CasoInterno } from '../../src/core/entities/CasoInterno.js';
import { VisibilityPolicy } from '../../src/core/domain-services/VisibilityPolicy.js';
import { InMemoryAuditRepository } from '../../src/core/ports/IAuditRepository.js';
import {
  PrioridadCaso,
  NivelVisibilidad,
  RolInstitucional
} from '../../src/core/value-objects/DomainTypes.js';

describe('Audit & Tri-Tier Communication Policies (GAMEA)', () => {
  test('Aislamiento Tri-Tier: El solicitante NO debe ver notas privadas ni coordinación interna', () => {
    const caso = new CasoInterno({
      id: 'caso-002',
      codigoCaso: 'CAS-2026-0002',
      solicitanteId: 'solicitante-ana',
      dependenciaOrigenId: 'DIR-CATASTRO',
      dependenciaActualId: 'DIR-FINANZAS',
      categoriaServicioId: 'PAGOS-SERVICIOS',
      prioridad: PrioridadCaso.MEDIA,
      asunto: 'Desbloqueo de partida presupuestaria distrital',
      descripcion: 'Solicitud para avanzar en compras menores de la Subalcaldía.'
    });

    caso.agregarComentario({
      id: 'c1',
      casoId: caso.id,
      autorId: 'solicitante-ana',
      visibilidad: NivelVisibilidad.COMUNICACION_SOLICITANTE,
      contenido: 'Se adjunta el formulario F-102 firmado.',
      fechaCreacion: new Date()
    });

    caso.agregarComentario({
      id: 'c2',
      casoId: caso.id,
      autorId: 'tecnico-finanzas',
      visibilidad: NivelVisibilidad.COMUNICACION_INTERNA,
      contenido: 'Coordinando con la Dirección de Planificación antes de autorizar.',
      fechaCreacion: new Date()
    });

    caso.agregarComentario({
      id: 'c3',
      casoId: caso.id,
      autorId: 'supervisor-finanzas',
      visibilidad: NivelVisibilidad.NOTA_PRIVADA,
      contenido: 'Revisar observaciones de auditoría 2025 para esta Subalcaldía.',
      fechaCreacion: new Date()
    });

    // Vista de Solicitante
    const comentariosVisiblesSolicitante = VisibilityPolicy.filtrarComentariosParaUsuario({
      comentarios: caso.comentarios,
      rolUsuario: RolInstitucional.SOLICITANTE,
      esSolicitanteDelCaso: true
    });
    assert.equal(comentariosVisiblesSolicitante.length, 1);
    assert.equal(comentariosVisiblesSolicitante[0].contenido, 'Se adjunta el formulario F-102 firmado.');

    // Vista de Técnico
    const comentariosVisiblesTecnico = VisibilityPolicy.filtrarComentariosParaUsuario({
      comentarios: caso.comentarios,
      rolUsuario: RolInstitucional.FUNCIONARIO_TECNICO,
      esSolicitanteDelCaso: false
    });
    assert.equal(comentariosVisiblesTecnico.length, 2);
    assert.ok(!comentariosVisiblesTecnico.some(c => c.visibilidad === NivelVisibilidad.NOTA_PRIVADA));

    // Vista de Supervisor / Auditor
    const comentariosVisiblesSupervisor = VisibilityPolicy.filtrarComentariosParaUsuario({
      comentarios: caso.comentarios,
      rolUsuario: RolInstitucional.SUPERVISOR_UNIDAD,
      esSolicitanteDelCaso: false
    });
    assert.equal(comentariosVisiblesSupervisor.length, 3);
  });

  test('Auditoría Inmutable Forense: Registro append-only y recuperación cronológica', async () => {
    const repoAuditoria = new InMemoryAuditRepository();

    await repoAuditoria.registrarEvento({
      id: 'evt-001',
      casoId: 'caso-002',
      actorId: 'tecnico-finanzas',
      accion: 'ASIGNACION',
      entidadAfectada: 'CasoInterno',
      entidadId: 'caso-002',
      justificacion: 'Auto-asignación para revisión técnica.',
      fechaEvento: new Date('2026-09-27T08:00:00Z')
    });

    await repoAuditoria.registrarEvento({
      id: 'evt-002',
      casoId: 'caso-002',
      actorId: 'supervisor-finanzas',
      accion: 'DERIVACION_INTERNA',
      entidadAfectada: 'CasoInterno',
      entidadId: 'caso-002',
      valorAnterior: { dependenciaActual: 'DIR-FINANZAS' },
      valorNuevo: { dependenciaActual: 'SUBALCALDIA-D1' },
      justificacion: 'Derivado a Subalcaldía Distrito 1 para verificación física.',
      fechaEvento: new Date('2026-09-27T08:30:00Z')
    });

    const historial = await repoAuditoria.obtenerHistorialPorCaso('caso-002');
    assert.equal(historial.length, 2);
    assert.equal(historial[0].id, 'evt-001');
    assert.equal(historial[1].id, 'evt-002');
    assert.equal(historial[1].accion, 'DERIVACION_INTERNA');
  });
});
