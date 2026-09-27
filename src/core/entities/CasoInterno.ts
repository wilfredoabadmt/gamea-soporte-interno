import {
  EstadoCaso,
  PrioridadCaso,
  TipoNovedad,
  EstadoDerivacion,
  NivelVisibilidad,
  NivelSensibilidad
} from '../value-objects/DomainTypes.js';

export interface NovedadData {
  id: string;
  casoId: string;
  autorId: string;
  tipo: TipoNovedad;
  titulo: string;
  descripcion: string;
  estadoResultante?: EstadoCaso;
  fechaRegistro: Date;
  evidencias?: string[];
}

export interface DerivacionData {
  id: string;
  casoId: string;
  dependenciaOrigenId: string;
  dependenciaDestinoId: string;
  funcionarioRemitenteId: string;
  funcionarioReceptorId?: string;
  motivoDerivacion: string;
  prioridad: PrioridadCaso;
  estado: EstadoDerivacion;
  fechaDerivacion: Date;
  fechaRecepcion?: Date;
  fechaConclusion?: Date;
  observacionesRespuesta?: string;
}

export interface ComentarioData {
  id: string;
  casoId: string;
  autorId: string;
  visibilidad: NivelVisibilidad;
  contenido: string;
  fechaCreacion: Date;
}

export class CasoInterno {
  private _id: string;
  private _codigoCaso: string;
  private _solicitanteId: string;
  private _dependenciaOrigenId: string;
  private _dependenciaActualId: string;
  private _responsableActualId?: string;
  private _categoriaServicioId: string;
  private _prioridad: PrioridadCaso;
  private _estado: EstadoCaso;
  private _asunto: string;
  private _descripcion: string;
  private _sensibilidad: NivelSensibilidad;
  private _fechaCreacion: Date;
  private _fechaResolucion?: Date;
  private _fechaCierre?: Date;

  private _novedades: NovedadData[] = [];
  private _derivaciones: DerivacionData[] = [];
  private _comentarios: ComentarioData[] = [];

  constructor(params: {
    id: string;
    codigoCaso: string;
    solicitanteId: string;
    dependenciaOrigenId: string;
    dependenciaActualId: string;
    responsableActualId?: string;
    categoriaServicioId: string;
    prioridad: PrioridadCaso;
    estado?: EstadoCaso;
    asunto: string;
    descripcion: string;
    sensibilidad?: NivelSensibilidad;
    fechaCreacion?: Date;
  }) {
    if (!params.id || !params.codigoCaso || !params.asunto || !params.descripcion) {
      throw new Error('Invariante violada: ID, código, asunto y descripción son obligatorios.');
    }
    this._id = params.id;
    this._codigoCaso = params.codigoCaso;
    this._solicitanteId = params.solicitanteId;
    this._dependenciaOrigenId = params.dependenciaOrigenId;
    this._dependenciaActualId = params.dependenciaActualId;
    this._responsableActualId = params.responsableActualId;
    this._categoriaServicioId = params.categoriaServicioId;
    this._prioridad = params.prioridad;
    this._estado = params.estado ?? EstadoCaso.REGISTRADO;
    this._asunto = params.asunto;
    this._descripcion = params.descripcion;
    this._sensibilidad = params.sensibilidad ?? NivelSensibilidad.OPERATIVA;
    this._fechaCreacion = params.fechaCreacion ?? new Date();
  }

  // Getters inmutables
  get id(): string { return this._id; }
  get codigoCaso(): string { return this._codigoCaso; }
  get solicitanteId(): string { return this._solicitanteId; }
  get dependenciaOrigenId(): string { return this._dependenciaOrigenId; }
  get dependenciaActualId(): string { return this._dependenciaActualId; }
  get responsableActualId(): string | undefined { return this._responsableActualId; }
  get categoriaServicioId(): string { return this._categoriaServicioId; }
  get prioridad(): PrioridadCaso { return this._prioridad; }
  get estado(): EstadoCaso { return this._estado; }
  get asunto(): string { return this._asunto; }
  get descripcion(): string { return this._descripcion; }
  get sensibilidad(): NivelSensibilidad { return this._sensibilidad; }
  get fechaCreacion(): Date { return this._fechaCreacion; }
  get fechaResolucion(): Date | undefined { return this._fechaResolucion; }
  get fechaCierre(): Date | undefined { return this._fechaCierre; }
  get novedades(): readonly NovedadData[] { return [...this._novedades]; }
  get derivaciones(): readonly DerivacionData[] { return [...this._derivaciones]; }
  get comentarios(): readonly ComentarioData[] { return [...this._comentarios]; }

  // Métodos de Dominio con Invariantes de Negocio

  public asignarResponsable(nuevoResponsableId: string, supervisorId: string): void {
    if (this._estado === EstadoCaso.CERRADO_CONFORME || this._estado === EstadoCaso.RECHAZADO_ORIGEN) {
      throw new Error(`No se puede asignar un caso en estado ${this._estado}`);
    }
    this._responsableActualId = nuevoResponsableId;
    if (this._estado === EstadoCaso.REGISTRADO || this._estado === EstadoCaso.EN_DERIVACION) {
      this._estado = EstadoCaso.ASIGNADO;
    }
    this.registrarNovedad({
      id: crypto.randomUUID(),
      casoId: this._id,
      autorId: supervisorId,
      tipo: TipoNovedad.AVANCE,
      titulo: 'Asignación de Responsable Operativo',
      descripcion: `Caso asignado al funcionario ID ${nuevoResponsableId}`,
      estadoResultante: this._estado,
      fechaRegistro: new Date()
    });
  }

  public iniciarAtencion(funcionarioId: string): void {
    if (this._estado !== EstadoCaso.ASIGNADO && this._estado !== EstadoCaso.EN_ESPERA_SOLICITANTE) {
      throw new Error(`Transición inválida: No se puede iniciar atención desde ${this._estado}`);
    }
    this._estado = EstadoCaso.EN_PROCESO;
    this.registrarNovedad({
      id: crypto.randomUUID(),
      casoId: this._id,
      autorId: funcionarioId,
      tipo: TipoNovedad.AVANCE,
      titulo: 'Inicio de Atención Técnica',
      descripcion: 'El funcionario responsable ha comenzado el tratamiento del caso.',
      estadoResultante: this._estado,
      fechaRegistro: new Date()
    });
  }

  public registrarNovedad(novedad: NovedadData): void {
    if (!novedad.titulo || !novedad.descripcion) {
      throw new Error('La Novedad Institucional requiere título y descripción detallada.');
    }
    this._novedades.push(novedad);
    if (novedad.estadoResultante) {
      this._estado = novedad.estadoResultante;
    }
  }

  public derivarHacia(params: {
    derivacionId: string;
    dependenciaDestinoId: string;
    funcionarioRemitenteId: string;
    motivo: string;
    prioridad?: PrioridadCaso;
  }): DerivacionData {
    if (this._estado === EstadoCaso.CERRADO_CONFORME || this._estado === EstadoCaso.RECHAZADO_ORIGEN) {
      throw new Error('No se puede derivar un caso formalmente cerrado o rechazado.');
    }
    if (this._dependenciaActualId === params.dependenciaDestinoId) {
      throw new Error('La derivación debe ser hacia una dependencia distinta. Para traspaso interno use Transferencia.');
    }

    const nuevaDerivacion: DerivacionData = {
      id: params.derivacionId,
      casoId: this._id,
      dependenciaOrigenId: this._dependenciaActualId,
      dependenciaDestinoId: params.dependenciaDestinoId,
      funcionarioRemitenteId: params.funcionarioRemitenteId,
      motivoDerivacion: params.motivo,
      prioridad: params.prioridad ?? this._prioridad,
      estado: EstadoDerivacion.SOLICITADA,
      fechaDerivacion: new Date()
    };

    this._derivaciones.push(nuevaDerivacion);
    this._dependenciaActualId = params.dependenciaDestinoId;
    this._responsableActualId = undefined; // Custodia pasa a la bandeja de entrada de la dependencia destino
    this._estado = EstadoCaso.EN_DERIVACION;

    this.registrarNovedad({
      id: crypto.randomUUID(),
      casoId: this._id,
      autorId: params.funcionarioRemitenteId,
      tipo: TipoNovedad.DERIVACION,
      titulo: `Derivación formal hacia dependencia ${params.dependenciaDestinoId}`,
      descripcion: params.motivo,
      estadoResultante: this._estado,
      fechaRegistro: new Date()
    });

    return nuevaDerivacion;
  }

  public aceptarDerivacion(derivacionId: string, funcionarioReceptorId: string): void {
    const derivacion = this._derivaciones.find(d => d.id === derivacionId);
    if (!derivacion) {
      throw new Error(`Derivación ${derivacionId} no encontrada en el caso.`);
    }
    derivacion.estado = EstadoDerivacion.ACEPTADA;
    derivacion.funcionarioReceptorId = funcionarioReceptorId;
    derivacion.fechaRecepcion = new Date();

    this._responsableActualId = funcionarioReceptorId;
    this._estado = EstadoCaso.ASIGNADO;

    this.registrarNovedad({
      id: crypto.randomUUID(),
      casoId: this._id,
      autorId: funcionarioReceptorId,
      tipo: TipoNovedad.AVANCE,
      titulo: 'Recepción y Aceptación de Derivación',
      descripcion: `La dependencia receptora ha aceptado el caso. Asignado a funcionario ${funcionarioReceptorId}`,
      estadoResultante: this._estado,
      fechaRegistro: new Date()
    });
  }

  public resolverCaso(funcionarioId: string, detalleResolucion: string): void {
    if (this._estado !== EstadoCaso.EN_PROCESO && this._estado !== EstadoCaso.ESCALADO) {
      throw new Error(`No se puede resolver un caso en estado ${this._estado}`);
    }
    this._estado = EstadoCaso.RESUELTO;
    this._fechaResolucion = new Date();

    this.registrarNovedad({
      id: crypto.randomUUID(),
      casoId: this._id,
      autorId: funcionarioId,
      tipo: TipoNovedad.RESULTADO,
      titulo: 'Resolución Operativa del Caso',
      descripcion: detalleResolucion,
      estadoResultante: this._estado,
      fechaRegistro: new Date()
    });
  }

  public cerrarConforme(usuarioId: string, observacionCierre: string): void {
    if (this._estado !== EstadoCaso.RESUELTO) {
      throw new Error('Solo se puede cerrar formalmente un caso en estado RESUELTO.');
    }
    this._estado = EstadoCaso.CERRADO_CONFORME;
    this._fechaCierre = new Date();

    this.registrarNovedad({
      id: crypto.randomUUID(),
      casoId: this._id,
      autorId: usuarioId,
      tipo: TipoNovedad.SEGUIMIENTO,
      titulo: 'Cierre Conforme Definitivo',
      descripcion: observacionCierre,
      estadoResultante: this._estado,
      fechaRegistro: new Date()
    });
  }

  public agregarComentario(comentario: ComentarioData): void {
    this._comentarios.push(comentario);
  }
}
