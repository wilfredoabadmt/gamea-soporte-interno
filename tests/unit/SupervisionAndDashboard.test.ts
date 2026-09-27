import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CasoInterno } from '../../src/core/entities/CasoInterno.js';
import { InMemoryCaseRepository } from '../../src/core/use-cases/DerivationUseCases.js';
import { InMemoryAuditRepository } from '../../src/core/ports/IAuditRepository.js';
import { SupervisorInterventionUseCase } from '../../src/core/use-cases/SupervisorInterventionUseCase.js';
import { GetDashboardMetricsUseCase } from '../../src/core/use-cases/GetDashboardMetricsUseCase.js';
import { PrioridadCaso, EstadoCaso } from '../../src/core/value-objects/DomainTypes.js';

describe('Supervision Intervention & Dashboard Analytics (GAMEA)', () => {
  test('Supervisor reasigna caso a nuevo técnico por balance de carga', async () => {
    const caseRepo = new InMemoryCaseRepository();
    const auditRepo = new InMemoryAuditRepository();

    const caso = new CasoInterno({
      id: 'caso-sup-01',
      codigoCaso: 'CAS-2026-SUP01',
      solicitanteId: 'func-solic',
      dependenciaOrigenId: 'DIR-CATASTRO',
      dependenciaActualId: 'DIR-CATASTRO',
      categoriaServicioId: 'LEVANTAMIENTO_TOPOGRAFICO',
      prioridad: PrioridadCaso.MEDIA,
      asunto: 'Plano georreferenciado distrito 5',
      descripcion: 'Pendiente de asignación urgente'
    });

    caso.asignarResponsable('tecnico-1', 'supervisor-jefe');
    await caseRepo.guardar(caso);

    const supUseCase = new SupervisorInterventionUseCase(caseRepo, auditRepo);
    await supUseCase.reasignarTecnico({
      casoId: 'caso-sup-01',
      nuevoTecnicoId: 'tecnico-2',
      supervisorId: 'supervisor-jefe',
      motivo: 'Sobrecarga de casos en tecnico-1 por contingencia distrital'
    });

    const casoActualizado = await caseRepo.obtenerPorId('caso-sup-01');
    assert.equal(casoActualizado?.responsableActualId, 'tecnico-2');

    const logs = await auditRepo.obtenerHistorialPorCaso('caso-sup-01');
    assert.ok(logs.some(l => l.accion === 'REASIGNACION_SUPERVISORIA'));
  });

  test('Cálculo de métricas consolidadas de dashboard por dependencia', async () => {
    const caseRepo = new InMemoryCaseRepository();

    const caso1 = new CasoInterno({
      id: 'c1',
      codigoCaso: 'CAS-1',
      solicitanteId: 's1',
      dependenciaOrigenId: 'SUBALCALDIA-D1',
      dependenciaActualId: 'SUBALCALDIA-D1',
      categoriaServicioId: 'CAT-1',
      prioridad: PrioridadCaso.MEDIA,
      asunto: 'Caso 1',
      descripcion: 'Desc'
    });
    caso1.asignarResponsable('t1', 's1');
    caso1.iniciarAtencion('t1');
    caso1.resolverCaso('t1', 'Solución');

    const caso2 = new CasoInterno({
      id: 'c2',
      codigoCaso: 'CAS-2',
      solicitanteId: 's1',
      dependenciaOrigenId: 'SUBALCALDIA-D1',
      dependenciaActualId: 'SUBALCALDIA-D1',
      categoriaServicioId: 'CAT-1',
      prioridad: PrioridadCaso.ALTA,
      asunto: 'Caso 2',
      descripcion: 'Desc'
    });
    caso2.asignarResponsable('t2', 's1');

    await caseRepo.guardar(caso1);
    await caseRepo.guardar(caso2);

    const dashboardUseCase = new GetDashboardMetricsUseCase(caseRepo);
    const metricas = await dashboardUseCase.obtenerMetricasDependencia('SUBALCALDIA-D1');

    assert.equal(metricas.totalCasos, 2);
    assert.equal(metricas.casosResueltos, 1);
    assert.equal(metricas.casosEnProceso, 1);
    assert.equal(metricas.tasaResolucionPorcentaje, 50);
  });
});
