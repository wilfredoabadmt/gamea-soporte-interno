import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { AIAssistantService, DocumentoNormativoRAG } from '../../src/core/domain-services/AIAssistantService.js';
import { PrioridadCaso } from '../../src/core/value-objects/DomainTypes.js';

describe('Enterprise AI & Institutional RAG Policies (GAMEA)', () => {
  test('Clasificación con confianza suficiente (>= 0.60) sugiere categoría y unidad', () => {
    const analisis = AIAssistantService.analizarSolicitudInterna({
      asunto: 'Caída de servidor y corte de fibra óptica',
      descripcion: 'Se reporta desconexión total del sistema de catastro en el rack del piso 2.'
    });

    assert.equal(analisis.esBajaConfianza, false);
    assert.ok(analisis.confianza >= 0.60);
    assert.equal(analisis.categoriaSugerida, 'SOPORTE_TECNOLOGICO');
    assert.equal(analisis.dependenciaSugeridaId, 'DIR-TECNOLOGIAS-INF');
    assert.equal(analisis.prioridadSugerida, PrioridadCaso.ALTA);
  });

  test('Fallback mandatorio por baja confianza (< 0.60) ante solicitud ambigua', () => {
    const analisis = AIAssistantService.analizarSolicitudInterna({
      asunto: 'Revisión general',
      descripcion: 'Favor atender asunto pendiente conversado ayer.'
    });

    assert.equal(analisis.esBajaConfianza, true);
    assert.ok(analisis.confianza < 0.60);
    assert.equal(analisis.categoriaSugerida, 'CONSULTA_GENERAL_PENDIENTE');
    assert.match(analisis.justificacionIA, /Confianza insuficiente/);
  });

  test('RAG Oficial con atribución de fuente formal institucional', () => {
    const normativaRepo: DocumentoNormativoRAG[] = [{
      documentoId: 'doc-001',
      codigoNormativo: 'RES-ADM-GAMEA-045/2025',
      titulo: 'Reglamento de Préstamo de Maquinaria Pesada en Subalcaldías',
      organoEmisor: 'Dirección de Infraestructura Pública',
      version: '2.1',
      fechaVigencia: '2025-01-01',
      contenidoRelevante: 'Plazo mínimo de 72 horas para solicitud distrital.',
      hashSha256: 'sha256:abc123mockhash'
    }];

    const resultado = AIAssistantService.responderConsultaNormativa({
      consulta: '¿Cuál es el procedimiento para solicitar maquinaria en una Subalcaldía?',
      documentosDisponibles: normativaRepo
    });

    assert.equal(resultado.requiereRevisionHumana, false);
    assert.ok(resultado.fuenteOficial);
    assert.equal(resultado.fuenteOficial.codigoNormativo, 'RES-ADM-GAMEA-045/2025');
    assert.match(resultado.respuesta, /72 horas/);
  });

  test('RAG sin fuente oficial suficiente transfiere mandatoriamente a revisión humana', () => {
    const resultado = AIAssistantService.responderConsultaNormativa({
      consulta: '¿Se puede autorizar viáticos extraordinarios para personal eventual?',
      documentosDisponibles: [] // Sin documentos normativos cargados
    });

    assert.equal(resultado.requiereRevisionHumana, true);
    assert.equal(resultado.fuenteOficial, undefined);
    assert.match(resultado.respuesta, /No se identificó documentación normativa institucional/);
  });
});
