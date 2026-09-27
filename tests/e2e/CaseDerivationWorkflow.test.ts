import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CasoInterno } from '../../src/core/entities/CasoInterno.js';
import { DeriveCaseUseCase, InMemoryCaseRepository } from '../../src/core/use-cases/DerivationUseCases.js';
import { InMemoryAuditRepository } from '../../src/core/ports/IAuditRepository.js';
import { VisibilityPolicy } from '../../src/core/domain-services/VisibilityPolicy.js';
import { AIAssistantService } from '../../src/core/domain-services/AIAssistantService.js';
import {
  PrioridadCaso,
  EstadoCaso,
  NivelVisibilidad,
  RolInstitucional
} from '../../src/core/value-objects/DomainTypes.js';

describe('E2E Acceptance Scenarios (Gherkin Compliance)', () => {
  test('Scenario 1: Derivación Inter-Oficinas sin pérdida de historial previo', async () => {
    const caseRepo = new InMemoryCaseRepository();
    const auditRepo = new InMemoryAuditRepository();

    // Given un Caso Interno con código "CAS-2026-0100" en estado "EN_PROCESO"
    const caso = new CasoInterno({
      id: 'caso-e2e-01',
      codigoCaso: 'CAS-2026-0100',
      solicitanteId: 'lic.mendoza',
      dependenciaOrigenId: 'DIR-JURIDICA',
      dependenciaActualId: 'DIR-JURIDICA',
      categoriaServicioId: 'ASESORIA_NORMATIVA',
      prioridad: PrioridadCaso.ALTA,
      asunto: 'Dictamen legal para obras en Subalcaldía Distrito 8',
      descripcion: 'Revisión de plano territorial.'
    });

    caso.asignarResponsable('dr.flores', 'supervisor-juridica');
    caso.iniciarAtencion('dr.flores');
    await caseRepo.guardar(caso);

    const novedadesOriginalesCount = caso.novedades.length; // 2 novedades iniciales

    // When el funcionario "dr.flores" ejecuta la acción de derivación hacia la "Subalcaldía Distrito 8"
    const deriveUseCase = new DeriveCaseUseCase(caseRepo, auditRepo);
    await deriveUseCase.execute({
      casoId: 'caso-e2e-01',
      dependenciaDestinoId: 'SUBALCALDIA-D8',
      funcionarioRemitenteId: 'dr.flores',
      motivo: 'Se deriva por corresponder a verificación técnica en territorio distrital'
    });

    // Then el estado del caso cambia a "EN_DERIVACION"
    const casoDerivado = await caseRepo.obtenerPorId('caso-e2e-01');
    assert.equal(casoDerivado?.estado, EstadoCaso.EN_DERIVACION);
    assert.equal(casoDerivado?.dependenciaActualId, 'SUBALCALDIA-D8');

    // And las Novedades originales se mantienen íntegras y legibles
    assert.equal(casoDerivado?.novedades.length, novedadesOriginalesCount + 1);
    assert.equal(casoDerivado?.novedades[2].titulo.includes('Subalcaldía'), false); // Registra destino formal
    
    // And se crea un registro de auditoría inmutable
    const logs = await auditRepo.obtenerHistorialPorCaso('caso-e2e-01');
    assert.equal(logs.length, 1);
    assert.equal(logs[0].accion, 'DERIVACION_INTERNA');
  });

  test('Scenario 2: Aislamiento estricto de Notas Privadas y comunicación interna', () => {
    // Given un Caso Interno "CAS-2026-0150"
    const caso = new CasoInterno({
      id: 'caso-e2e-02',
      codigoCaso: 'CAS-2026-0150',
      solicitanteId: 'lic.mendoza',
      dependenciaOrigenId: 'DIR-CATASTRO',
      dependenciaActualId: 'DIR-FINANZAS',
      categoriaServicioId: 'PRESUPUESTO',
      prioridad: PrioridadCaso.MEDIA,
      asunto: 'Desembolso distrital',
      descripcion: 'Verificación presupuestaria.'
    });

    // And comentarios clasificados
    caso.agregarComentario({
      id: 'c1',
      casoId: caso.id,
      autorId: 'lic.mendoza',
      visibilidad: NivelVisibilidad.COMUNICACION_SOLICITANTE,
      contenido: 'Envío de antecedentes requeridos.',
      fechaCreacion: new Date()
    });

    caso.agregarComentario({
      id: 'c2',
      casoId: caso.id,
      autorId: 'supervisor-finanzas',
      visibilidad: NivelVisibilidad.NOTA_PRIVADA,
      contenido: 'Revisar auditoría interna antes de autorizar.',
      fechaCreacion: new Date()
    });

    // When el solicitante consulta el detalle
    const visibles = VisibilityPolicy.filtrarComentariosParaUsuario({
      comentarios: caso.comentarios,
      rolUsuario: RolInstitucional.SOLICITANTE,
      esSolicitanteDelCaso: true
    });

    // Then el sistema NO debe listar notas privadas
    assert.equal(visibles.length, 1);
    assert.equal(visibles[0].visibilidad, NivelVisibilidad.COMUNICACION_SOLICITANTE);
    assert.ok(!visibles.some(c => c.visibilidad === NivelVisibilidad.NOTA_PRIVADA));
  });

  test('Scenario 3: Asistencia IA bajo control de confianza y retención de autoridad humana', () => {
    // Given un caso con descripción ambigua
    const resultado = AIAssistantService.analizarSolicitudInterna({
      asunto: 'Tema pendiente',
      descripcion: 'Favor atender lo conversado en la reunión.'
    });

    // When el motor obtiene confianza inferior a 0.60
    assert.ok(resultado.confianza < 0.60);
    assert.equal(resultado.esBajaConfianza, true);

    // Then el sistema NO auto-deriva y enruta a triaje humano
    assert.equal(resultado.categoriaSugerida, 'CONSULTA_GENERAL_PENDIENTE');
  });
});
