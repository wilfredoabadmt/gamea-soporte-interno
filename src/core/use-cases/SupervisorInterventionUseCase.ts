import { ICaseRepository } from './DerivationUseCases.js';
import { IAuditRepository } from '../ports/IAuditRepository.js';
import { TipoNovedad, EstadoCaso } from '../value-objects/DomainTypes.js';

export class SupervisorInterventionUseCase {
  constructor(
    private caseRepo: ICaseRepository,
    private auditRepo: IAuditRepository
  ) {}

  /**
   * Reasigna la carga operativa de un técnico a otro dentro de la misma dependencia
   */
  async reasignarTecnico(params: {
    casoId: string;
    nuevoTecnicoId: string;
    supervisorId: string;
    motivo: string;
    ipOrigen?: string;
  }): Promise<void> {
    const caso = await this.caseRepo.obtenerPorId(params.casoId);
    if (!caso) throw new Error(`Caso no encontrado: ${params.casoId}`);

    const tecnicoAnterior = caso.responsableActualId;
    caso.asignarResponsable(params.nuevoTecnicoId, params.supervisorId);

    caso.registrarNovedad({
      id: crypto.randomUUID(),
      casoId: caso.id,
      autorId: params.supervisorId,
      tipo: TipoNovedad.INSTRUCCION,
      titulo: 'Intervención de Supervisión: Reasignación de Carga',
      descripcion: `Reasignado de ${tecnicoAnterior || 'Sin Asignar'} a ${params.nuevoTecnicoId}. Motivo: ${params.motivo}`,
      fechaRegistro: new Date()
    });

    await this.caseRepo.guardar(caso);

    await this.auditRepo.registrarEvento({
      id: crypto.randomUUID(),
      casoId: caso.id,
      actorId: params.supervisorId,
      accion: 'REASIGNACION_SUPERVISORIA',
      entidadAfectada: 'CasoInterno',
      entidadId: caso.id,
      valorAnterior: { responsableActualId: tecnicoAnterior },
      valorNuevo: { responsableActualId: params.nuevoTecnicoId },
      justificacion: params.motivo,
      ipOrigen: params.ipOrigen,
      fechaEvento: new Date()
    });
  }

  /**
   * Cierre administrativo por parte del supervisor ante casos desistidos o duplicados
   */
  async cierreAdministrativo(params: {
    casoId: string;
    supervisorId: string;
    motivoCierre: string;
    ipOrigen?: string;
  }): Promise<void> {
    const caso = await this.caseRepo.obtenerPorId(params.casoId);
    if (!caso) throw new Error(`Caso no encontrado: ${params.casoId}`);

    const estadoAnterior = caso.estado;
    caso.resolverCaso(params.supervisorId, `Cierre administrativo dictaminado por supervisión: ${params.motivoCierre}`);
    caso.cerrarConforme(params.supervisorId, `Validación de cierre por autoridad de unidad: ${params.motivoCierre}`);

    await this.caseRepo.guardar(caso);

    await this.auditRepo.registrarEvento({
      id: crypto.randomUUID(),
      casoId: caso.id,
      actorId: params.supervisorId,
      accion: 'CIERRE_ADMINISTRATIVO_SUPERVISOR',
      entidadAfectada: 'CasoInterno',
      entidadId: caso.id,
      valorAnterior: { estado: estadoAnterior },
      valorNuevo: { estado: EstadoCaso.CERRADO_CONFORME },
      justificacion: params.motivoCierre,
      ipOrigen: params.ipOrigen,
      fechaEvento: new Date()
    });
  }
}
