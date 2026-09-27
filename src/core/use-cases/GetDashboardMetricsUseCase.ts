import { ICaseRepository } from './DerivationUseCases.js';
import { EstadoCaso } from '../value-objects/DomainTypes.js';

export interface DashboardMetricsDTO {
  totalCasos: number;
  casosEnProceso: number;
  casosEnDerivacion: number;
  casosResueltos: number;
  casosCerrados: number;
  tasaResolucionPorcentaje: number;
}

export class GetDashboardMetricsUseCase {
  constructor(private caseRepo: ICaseRepository) {}

  async obtenerMetricasDependencia(dependenciaId: string): Promise<DashboardMetricsDTO> {
    const casos = await this.caseRepo.listarPorDependencia(dependenciaId);
    const total = casos.length;
    if (total === 0) {
      return {
        totalCasos: 0,
        casosEnProceso: 0,
        casosEnDerivacion: 0,
        casosResueltos: 0,
        casosCerrados: 0,
        tasaResolucionPorcentaje: 0
      };
    }

    const enProceso = casos.filter(c => c.estado === EstadoCaso.EN_PROCESO || c.estado === EstadoCaso.ASIGNADO).length;
    const enDerivacion = casos.filter(c => c.estado === EstadoCaso.EN_DERIVACION).length;
    const resueltos = casos.filter(c => c.estado === EstadoCaso.RESUELTO).length;
    const cerrados = casos.filter(c => c.estado === EstadoCaso.CERRADO_CONFORME).length;

    const concluidos = resueltos + cerrados;
    const tasa = Math.round((concluidos / total) * 100);

    return {
      totalCasos: total,
      casosEnProceso: enProceso,
      casosEnDerivacion: enDerivacion,
      casosResueltos: resueltos,
      casosCerrados: cerrados,
      tasaResolucionPorcentaje: tasa
    };
  }
}
