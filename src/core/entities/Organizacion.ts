import { TipoDependencia, RolInstitucional } from '../value-objects/DomainTypes.js';

export class DependenciaOrganizacional {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly tipo: TipoDependencia,
    public readonly dependenciaPadreId?: string,
    public readonly esSubalcaldia: boolean = false,
    public readonly distritoMunicipal?: number,
    public readonly activo: boolean = true
  ) {}
}

export class UsuarioFuncionario {
  constructor(
    public readonly id: string,
    public readonly carnetIdentidad: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly emailInstitucional: string,
    public readonly cargo: string,
    public readonly dependenciaId: string,
    public readonly rol: RolInstitucional,
    public readonly activo: boolean = true
  ) {}

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`.trim();
  }
}
