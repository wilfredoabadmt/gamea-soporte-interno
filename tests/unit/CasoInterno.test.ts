import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CasoInterno } from '../../src/core/entities/CasoInterno.js';
import {
  EstadoCaso,
  PrioridadCaso,
  TipoNovedad,
  EstadoDerivacion,
  NivelSensibilidad
} from '../../src/core/value-objects/DomainTypes.js';

describe('CasoInterno Entity & Business Invariants (GAMEA)', () => {
  const casoValido = () => new CasoInterno({
    id: 'caso-uuid-001',
    codigoCaso: 'CAS-2026-0001',
    solicitanteId: 'func-solicitante-01',
    dependenciaOrigenId: 'DIR-JURIDICA',
    dependenciaActualId: 'DIR-TECNOLOGIAS-INF',
    categoriaServicioId: 'SOPORTE-REDES',
    prioridad: PrioridadCaso.ALTA,
    asunto: 'Falla de conectividad en enlace de fibra',
    descripcion: 'No hay acceso al sistema interno desde el piso 3 de la casa municipal.',
    sensibilidad: NivelSensibilidad.OPERATIVA
  });

  test('Debe instanciarse correctamente en estado REGISTRADO y sin responsable inicial', () => {
    const caso = casoValido();
    assert.equal(caso.estado, EstadoCaso.REGISTRADO);
    assert.equal(caso.codigoCaso, 'CAS-2026-0001');
    assert.equal(caso.responsableActualId, undefined);
    assert.equal(caso.novedades.length, 0);
  });

  test('Debe transicionar a ASIGNADO y generar Novedad cuando el supervisor asigna un técnico', () => {
    const caso = casoValido();
    caso.asignarResponsable('tecnico-juan', 'supervisor-carlos');
    
    assert.equal(caso.estado, EstadoCaso.ASIGNADO);
    assert.equal(caso.responsableActualId, 'tecnico-juan');
    assert.equal(caso.novedades.length, 1);
    assert.equal(caso.novedades[0].tipo, TipoNovedad.AVANCE);
    assert.equal(caso.novedades[0].autorId, 'supervisor-carlos');
  });

  test('Debe transicionar a EN_PROCESO cuando el técnico asignado inicia atención', () => {
    const caso = casoValido();
    caso.asignarResponsable('tecnico-juan', 'supervisor-carlos');
    caso.iniciarAtencion('tecnico-juan');
    
    assert.equal(caso.estado, EstadoCaso.EN_PROCESO);
    assert.equal(caso.novedades.length, 2);
  });

  test('Debe ejecutar DERIVACIÓN formal hacia una Subalcaldía sin borrar el historial anterior', () => {
    const caso = casoValido();
    caso.asignarResponsable('tecnico-juan', 'supervisor-carlos');
    caso.iniciarAtencion('tecnico-juan');

    // Derivación hacia Subalcaldía Distrito 3
    const derivacion = caso.derivarHacia({
      derivacionId: 'deriv-001',
      dependenciaDestinoId: 'SUBALCALDIA-D3',
      funcionarioRemitenteId: 'tecnico-juan',
      motivo: 'Verificación de cableado estructural en predio distrital.'
    });

    assert.equal(caso.estado, EstadoCaso.EN_DERIVACION);
    assert.equal(caso.dependenciaActualId, 'SUBALCALDIA-D3');
    assert.equal(caso.responsableActualId, undefined, 'La custodia pasa a la bandeja general de la dependencia destino');
    assert.equal(derivacion.estado, EstadoDerivacion.SOLICITADA);
    
    // Comprobación de preservación de historial
    assert.equal(caso.novedades.length, 3);
    assert.equal(caso.novedades[2].tipo, TipoNovedad.DERIVACION);
    assert.equal(caso.derivaciones.length, 1);
  });

  test('Debe permitir la aceptación de derivación en la dependencia destino y reasignación', () => {
    const caso = casoValido();
    caso.asignarResponsable('tecnico-juan', 'supervisor-carlos');
    caso.iniciarAtencion('tecnico-juan');
    caso.derivarHacia({
      derivacionId: 'deriv-001',
      dependenciaDestinoId: 'SUBALCALDIA-D3',
      funcionarioRemitenteId: 'tecnico-juan',
      motivo: 'Revisión territorial.'
    });

    caso.aceptarDerivacion('deriv-001', 'tecnico-subalcaldia-pedro');

    assert.equal(caso.estado, EstadoCaso.ASIGNADO);
    assert.equal(caso.responsableActualId, 'tecnico-subalcaldia-pedro');
    assert.equal(caso.derivaciones[0].estado, EstadoDerivacion.ACEPTADA);
    assert.equal(caso.novedades.length, 4);
  });

  test('Debe resolver el caso y permitir posterior cierre conforme', () => {
    const caso = casoValido();
    caso.asignarResponsable('tecnico-juan', 'supervisor-carlos');
    caso.iniciarAtencion('tecnico-juan');
    
    caso.resolverCaso('tecnico-juan', 'Enlace de fibra empalmado y verificado con 100 Mbps simétricos.');
    assert.equal(caso.estado, EstadoCaso.RESUELTO);
    assert.ok(caso.fechaResolucion);

    caso.cerrarConforme('func-solicitante-01', 'Confirmada conectividad en todo el piso 3.');
    assert.equal(caso.estado, EstadoCaso.CERRADO_CONFORME);
    assert.ok(caso.fechaCierre);
  });
});
