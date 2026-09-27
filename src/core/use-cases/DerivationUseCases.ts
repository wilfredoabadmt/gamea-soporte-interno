import { CasoInterno, DerivacionData } from '../entities/CasoInterno.js';
import { IAuditRepository } from '../ports/IAuditRepository.js';
import { PrioridadCaso, TipoNovedad, EstadoDerivacion } from '../value-objects/DomainTypes.js';

export interface ICaseRepository {
  obtenerPorId(id: string): Promise<CasoInterno | null>;
  guardar(caso: CasoInterno): Promise<void>;
  listarPorDependencia(dependenciaId: string): Promise<readonly CasoInterno[]>;
}

export class InMemoryCaseRepository implements ICaseRepository {
  private _casos = new Map<string, CasoInterno>();

  async obtenerPorId(id: string): Promise<CasoInterno | null> {
    return this._casos.get(id) || null;
  }

  async guardar(caso: CasoInterno): Promise<void> {
    this._casos.set(caso.id, caso);
  }

  async listarPorDependencia(dependenciaId: string): Promise<readonly CasoInterno[]> {
    return Array.from(this._casos.values()).filter(c => c.dependenciaActualId === dependenciaId);
  }
}

export class DeriveCaseUseCase {
  constructor(
    private caseRepo: ICaseRepository,
    private auditRepo: IAuditRepository
  ) {}

  async execute(params: {
    casoId: string;
    dependenciaDestinoId: string;
    funcionarioRemitenteId: string;
    motivo: string;
    prioridad?: PrioridadCaso;
    ipOrigen?: string;
  }): Promise<DerivacionData> {
    const caso = await this.caseRepo.obtenerPorId(params.casoId);
    if (!caso) {
      throw new Error(`Caso no encontrado: ${params.casoId}`);
    }

    const dependenciaPrevia = caso.dependenciaActualId;
    const estadoPrevio = caso.estado;

    const derivacion = caso.derivarHacia({
      derivacionId: crypto.randomUUID(),
      dependenciaDestinoId: params.dependenciaDestinoId,
      funcionarioRemitenteId: params.funcionarioRemitenteId,
      motivo: params.motivo,
      prioridad: params.prioridad
    });

    await this.caseRepo.guardar(caso);

    await this.auditRepo.registrarEvento({
      id: crypto.randomUUID(),
      casoId: caso.id,
      actorId: params.funcionarioRemitenteId,
      accion: 'DERIVACION_INTERNA',
      entidadAfectada: 'CasoInterno',
      entidadId: caso.id,
      valorAnterior: { dependenciaActualId: dependenciaPrevia, estado: estadoPrevio },
      valorNuevo: { dependenciaActualId: params.dependenciaDestinoId, estado: caso.estado },
      justificacion: params.motivo,
      ipOrigen: params.ipOrigen,
      fechaEvento: new Date()
    });

    return derivacion;
  }
}

export class AcknowledgeDerivationUseCase {
  constructor(
    private caseRepo: ICaseRepository,
    private auditRepo: IAuditRepository
  ) {}

  async aceptar(params: {
    casoId: string;
    derivacionId: string;
    funcionarioReceptorId: string;
    ipOrigen?: string;
  }): Promise<void> {
    const caso = await this.caseRepo.obtenerPorId(params.casoId);
    if (!caso) throw new Error(`Caso no encontrado: ${params.casoId}`);

    caso.aceptarDerivacion(params.derivacionId, params.funcionarioReceptorId);
    await this.caseRepo.guardar(caso);

    await this.auditRepo.registrarEvento({
      id: crypto.randomUUID(),
      casoId: caso.id,
      actorId: params.funcionarioReceptorId,
      accion: 'ACEPTACION_DERIVACION',
      entidadAfectada: 'CasoInterno',
      entidadId: caso.id,
      justificacion: `Derivación ${params.derivacionId} aceptada y asignada al funcionario ${params.funcionarioReceptorId}`,
      ipOrigen: params.ipOrigen,
      fechaEvento: new Date()
    });
  }

  async rechazar(params: {
    casoId: string;
    derivacionId: string;
    funcionarioRechazadorId: string;
    motivoRechazo: string;
    ipOrigen?: string;
  }): Promise<void> {
    const caso = await this.caseRepo.obtenerPorId(params.casoId);
    if (!caso) throw new Error(`Caso no encontrado: ${params.casoId}`);

    const derivacion = caso.derivaciones.find(d => d.id === params.derivacionId);
    if (!derivacion) throw new Error(`Derivación ${params.derivacionId} no encontrada`);

    derivacion.estado = EstadoDerivacion.RECHAZADA;
    derivacion.observacionesRespuesta = params.motivoRechazo;
    derivacion.fechaConclusion = new Date();

    // Retorna la custodia a la dependencia remitente original
    caso.registrarNovedad({
      id: crypto.randomUUID(),
      casoId: caso.id,
      autorId: params.funcionarioRechazadorId,
      tipo: TipoNovedad.OBSERVACION,
      titulo: 'Rechazo de Derivación Inter-Oficinas',
      descripcion: `La dependencia receptora rechazó la derivación por: ${params.motivoRechazo}`,
      fechaRegistro: new Date()
    });

    await this.caseRepo.guardar(caso);

    await this.auditRepo.registrarEvento({
      id: crypto.randomUUID(),
      casoId: caso.id,
      actorId: params.funcionarioRechazadorId,
      accion: 'RECHAZO_DERIVACION',
      entidadAfectada: 'CasoInterno',
      entidadId: caso.id,
      justificacion: params.motivoRechazo,
      ipOrigen: params.ipOrigen,
      fechaEvento: new Date()
    });
  }
}
