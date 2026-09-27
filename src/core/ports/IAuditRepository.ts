export interface EventoAuditoria {
  id: string;
  casoId: string;
  actorId: string;
  accion: string;
  entidadAfectada: string;
  entidadId: string;
  valorAnterior?: Record<string, unknown>;
  valorNuevo?: Record<string, unknown>;
  justificacion: string;
  ipOrigen?: string;
  fechaEvento: Date;
}

export interface IAuditRepository {
  registrarEvento(evento: EventoAuditoria): Promise<void>;
  obtenerHistorialPorCaso(casoId: string): Promise<readonly EventoAuditoria[]>;
}

export class InMemoryAuditRepository implements IAuditRepository {
  private _eventos: EventoAuditoria[] = [];

  async registrarEvento(evento: EventoAuditoria): Promise<void> {
    // Append-only: Prohibido modificar o eliminar eventos existentes
    this._eventos.push(Object.freeze({ ...evento }));
  }

  async obtenerHistorialPorCaso(casoId: string): Promise<readonly EventoAuditoria[]> {
    return this._eventos
      .filter(e => e.casoId === casoId)
      .sort((a, b) => a.fechaEvento.getTime() - b.fechaEvento.getTime());
  }
}
