import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CasoInterno } from '../../src/core/entities/CasoInterno.js';
import {
  DeriveCaseUseCase,
  AcknowledgeDerivationUseCase,
  InMemoryCaseRepository
} from '../../src/core/use-cases/DerivationUseCases.js';
import { InMemoryAuditRepository } from '../../src/core/ports/IAuditRepository.js';
import { SLACalculatorService, SemaforoSLA } from '../../src/core/domain-services/SLACalculatorService.js';
import { PrioridadCaso, EstadoCaso, EstadoDerivacion } from '../../src/core/value-objects/DomainTypes.js';

describe('Derivation Engine & SLA Watchdog (GAMEA)', () => {
  test('Flujo completo de Derivación hacia Subalcaldía y Aceptación con Auditoría', async () => {
    const caseRepo = new InMemoryCaseRepository();
    const auditRepo = new InMemoryAuditRepository();

    const caso = new CasoInterno({
      id: 'caso-deriv-01',
      codigoCaso: 'CAS-2026-D01',
      solicitanteId: 'func-despacho',
      dependenciaOrigenId: 'DIR-INFRAESTRUCTURA',
      dependenciaActualId: 'DIR-INFRAESTRUCTURA',
      categoriaServicioId: 'MANTENIMIENTO_VIAL',
      prioridad: PrioridadCaso.ALTA,
      asunto: 'Bacheo prioritario avenida principal',
      descripcion: 'Requiere inspección distrital in situ.'
    });

    await caseRepo.guardar(caso);

    const deriveUseCase = new DeriveCaseUseCase(caseRepo, auditRepo);
    const derivacion = await deriveUseCase.execute({
      casoId: 'caso-deriv-01',
      dependenciaDestinoId: 'SUBALCALDIA-D4',
      funcionarioRemitenteId: 'ing-perez',
      motivo: 'Verificación técnica en territorio del Distrito 4.'
    });

    const casoEnDerivacion = await caseRepo.obtenerPorId('caso-deriv-01');
    assert.equal(casoEnDerivacion?.estado, EstadoCaso.EN_DERIVACION);
    assert.equal(casoEnDerivacion?.dependenciaActualId, 'SUBALCALDIA-D4');

    // Aceptación por la Subalcaldía
    const ackUseCase = new AcknowledgeDerivationUseCase(caseRepo, auditRepo);
    await ackUseCase.aceptar({
      casoId: 'caso-deriv-01',
      derivacionId: derivacion.id,
      funcionarioReceptorId: 'tecnico-distrital-mamani'
    });

    const casoAceptado = await caseRepo.obtenerPorId('caso-deriv-01');
    assert.equal(casoAceptado?.estado, EstadoCaso.ASIGNADO);
    assert.equal(casoAceptado?.responsableActualId, 'tecnico-distrital-mamani');

    // Verificar que auditoría registró ambos eventos
    const logs = await auditRepo.obtenerHistorialPorCaso('caso-deriv-01');
    assert.equal(logs.length, 2);
    assert.equal(logs[0].accion, 'DERIVACION_INTERNA');
    assert.equal(logs[1].accion, 'ACEPTACION_DERIVACION');
  });

  test('Cálculo de semáforo SLA institucional y pausas operativas', () => {
    const inicio = new Date('2026-09-27T08:00:00Z');
    const tiempoLimite = 120; // 2 horas (120 minutos)

    // Caso 1: 30 minutos transcurridos (25%) -> VERDE_EN_PLAZO
    const m1 = SLACalculatorService.calcularEstadoSLA({
      fechaInicio: inicio,
      tiempoLimiteMinutos: tiempoLimite,
      fechaReferencia: new Date('2026-09-27T08:30:00Z')
    });
    assert.equal(m1.semaforo, SemaforoSLA.VERDE_EN_PLAZO);
    assert.equal(m1.porcentajeConsumido, 25);
    assert.equal(m1.estaVencido, false);

    // Caso 2: 95 minutos transcurridos (79%) -> AMARILLO_PREVENTIVO
    const m2 = SLACalculatorService.calcularEstadoSLA({
      fechaInicio: inicio,
      tiempoLimiteMinutos: tiempoLimite,
      fechaReferencia: new Date('2026-09-27T09:35:00Z')
    });
    assert.equal(m2.semaforo, SemaforoSLA.AMARILLO_PREVENTIVO);

    // Caso 3: 130 minutos con 30 minutos pausados (efectivo: 100 min = 83%) -> AMARILLO
    const m3 = SLACalculatorService.calcularEstadoSLA({
      fechaInicio: inicio,
      tiempoLimiteMinutos: tiempoLimite,
      tiempoPausadoMinutos: 30,
      fechaReferencia: new Date('2026-09-27T10:10:00Z')
    });
    assert.equal(m3.tiempoTranscurridoMinutos, 100);
    assert.equal(m3.estaVencido, false);

    // Caso 4: 150 minutos sin pausa -> ROJO_VENCIDO
    const m4 = SLACalculatorService.calcularEstadoSLA({
      fechaInicio: inicio,
      tiempoLimiteMinutos: tiempoLimite,
      fechaReferencia: new Date('2026-09-27T10:30:00Z')
    });
    assert.equal(m4.semaforo, SemaforoSLA.ROJO_VENCIDO);
    assert.equal(m4.estaVencido, true);
  });
});
