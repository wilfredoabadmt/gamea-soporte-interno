export enum SemaforoSLA {
  VERDE_EN_PLAZO = 'VERDE_EN_PLAZO',       // 0% a 70%
  AMARILLO_PREVENTIVO = 'AMARILLO_PREVENTIVO', // 71% a 85%
  NARANJA_URGENTE = 'NARANJA_URGENTE',     // 86% a 99%
  ROJO_VENCIDO = 'ROJO_VENCIDO'            // >= 100%
}

export interface MetricasSLA {
  tiempoTranscurridoMinutos: number;
  tiempoLimiteMinutos: number;
  porcentajeConsumido: number;
  semaforo: SemaforoSLA;
  estaVencido: boolean;
  minutosRestantes: number;
}

export class SLACalculatorService {
  /**
   * Calcula el estado de SLA para un caso considerando minutos transcurridos y umbrales normados
   */
  public static calcularEstadoSLA(params: {
    fechaInicio: Date;
    tiempoLimiteMinutos: number;
    tiempoPausadoMinutos?: number;
    fechaReferencia?: Date;
  }): MetricasSLA {
    const ahora = params.fechaReferencia ?? new Date();
    const tiempoPausado = params.tiempoPausadoMinutos ?? 0;
    
    const diffMs = ahora.getTime() - params.fechaInicio.getTime();
    const minutosBrutos = Math.max(0, Math.floor(diffMs / (1000 * 60)));
    const tiempoEfectivo = Math.max(0, minutosBrutos - tiempoPausado);

    const porcentaje = Math.round((tiempoEfectivo / params.tiempoLimiteMinutos) * 100);
    const estaVencido = tiempoEfectivo >= params.tiempoLimiteMinutos;
    const minutosRestantes = Math.max(0, params.tiempoLimiteMinutos - tiempoEfectivo);

    let semaforo: SemaforoSLA;
    if (porcentaje >= 100) {
      semaforo = SemaforoSLA.ROJO_VENCIDO;
    } else if (porcentaje >= 86) {
      semaforo = SemaforoSLA.NARANJA_URGENTE;
    } else if (porcentaje >= 71) {
      semaforo = SemaforoSLA.AMARILLO_PREVENTIVO;
    } else {
      semaforo = SemaforoSLA.VERDE_EN_PLAZO;
    }

    return {
      tiempoTranscurridoMinutos: tiempoEfectivo,
      tiempoLimiteMinutos: params.tiempoLimiteMinutos,
      porcentajeConsumido: porcentaje,
      semaforo,
      estaVencido,
      minutosRestantes
    };
  }
}
