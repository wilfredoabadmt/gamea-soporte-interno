import { PrediccionClasificacionIA } from '../domain-services/AIAssistantService.js';

export interface TelemetriaActiveLearning {
  id: string;
  casoId: string;
  asuntoOriginal: string;
  descripcionOriginal: string;
  prediccionIA: PrediccionClasificacionIA;
  decisionHumana: {
    categoriaFinal: string;
    dependenciaDestinoFinalId: string;
    funcionarioId: string;
    motivoCorreccion?: string;
  };
  fechaRegistro: Date;
}

export interface IActiveLearningRepository {
  registrarCorreccion(telemetria: TelemetriaActiveLearning): Promise<void>;
  obtenerCasosParaReentrenamiento(): Promise<readonly TelemetriaActiveLearning[]>;
}

export class InMemoryActiveLearningRepository implements IActiveLearningRepository {
  private _registros: TelemetriaActiveLearning[] = [];

  async registrarCorreccion(telemetria: TelemetriaActiveLearning): Promise<void> {
    this._registros.push(Object.freeze({ ...telemetria }));
  }

  async obtenerCasosParaReentrenamiento(): Promise<readonly TelemetriaActiveLearning[]> {
    return [...this._registros];
  }
}
