import { NivelVisibilidad, RolInstitucional } from '../value-objects/DomainTypes.js';
import { ComentarioData } from '../entities/CasoInterno.js';

export class VisibilityPolicy {
  /**
   * Filtra los comentarios de un caso según el rol institucional y contexto del funcionario.
   * Regla de Oro:
   * 1. SOLICITANTE: Solo ve COMUNICACION_SOLICITANTE.
   * 2. FUNCIONARIO_TECNICO: Ve COMUNICACION_SOLICITANTE y COMUNICACION_INTERNA (pero NUNCA NOTA_PRIVADA).
   * 3. SUPERVISOR / DIRECTOR / AUTORIDAD / AUDITOR: Tienen clearence para ver los 3 niveles.
   */
  public static filtrarComentariosParaUsuario(params: {
    comentarios: readonly ComentarioData[];
    rolUsuario: RolInstitucional;
    esSolicitanteDelCaso: boolean;
  }): ComentarioData[] {
    const { comentarios, rolUsuario, esSolicitanteDelCaso } = params;

    return comentarios.filter(c => {
      // Si el usuario consulta en calidad de Solicitante del caso
      if (esSolicitanteDelCaso && rolUsuario === RolInstitucional.SOLICITANTE) {
        return c.visibilidad === NivelVisibilidad.COMUNICACION_SOLICITANTE;
      }

      // Si es un técnico de la unidad que atiende el caso
      if (rolUsuario === RolInstitucional.FUNCIONARIO_TECNICO) {
        return c.visibilidad === NivelVisibilidad.COMUNICACION_SOLICITANTE ||
               c.visibilidad === NivelVisibilidad.COMUNICACION_INTERNA;
      }

      // Roles de supervisión, directivos, auditoría o administración
      if (
        rolUsuario === RolInstitucional.SUPERVISOR_UNIDAD ||
        rolUsuario === RolInstitucional.DIRECTOR ||
        rolUsuario === RolInstitucional.SUBALCALDE ||
        rolUsuario === RolInstitucional.AUTORIDAD_INSTITUCIONAL ||
        rolUsuario === RolInstitucional.AUDITOR_INTERNO ||
        rolUsuario === RolInstitucional.ADMINISTRADOR_FUNCIONAL
      ) {
        return true;
      }

      // Por defecto (mínimo privilegio), solo comunicación con solicitante
      return c.visibilidad === NivelVisibilidad.COMUNICACION_SOLICITANTE;
    });
  }
}
