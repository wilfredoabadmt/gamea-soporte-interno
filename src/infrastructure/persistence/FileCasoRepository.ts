import fs from 'node:fs';
import path from 'node:path';

export interface NovedadRecord {
  id?: string;
  titulo: string;
  autor: string;
  fecha: string;
  descripcion: string;
  color?: string;
}

export interface CasoRecord {
  id: string;
  codigo: string;
  titulo: string;
  solicitanteId: string;
  solicitanteNombre: string;
  origen: string;
  destino: string;
  dependenciaActualId: string;
  responsable: string;
  prioridad: string;
  estado: string;
  slaRestante: string;
  distrito: number | null;
  descripcion: string;
  novedades: NovedadRecord[];
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_CASES: CasoRecord[] = [
  {
    id: 'CAS-2026-0084',
    codigo: 'CAS-2026-0084',
    titulo: 'Falla de enlace de fibra óptica y red interna en piso 3',
    solicitanteId: 'usr-002',
    solicitanteNombre: 'Dr. Carlos Flores Mendizábal',
    origen: 'Dirección General de Asesoría Jurídica',
    destino: 'Dirección de Tecnologías e Información',
    dependenciaActualId: 'DIR-TECNOLOGIAS-INF',
    responsable: 'Lic. Marco Antonio Quispe',
    prioridad: 'ALTA',
    estado: 'EN_PROCESO',
    slaRestante: '2h restantes',
    distrito: null,
    descripcion: 'El personal técnico de la Dirección Jurídica reporta cortes intermitentes en la base de datos central. Se requiere verificación in situ del rack de comunicaciones y empalmes.',
    novedades: [
      {
        titulo: 'Inicio de Atención Técnica',
        autor: 'Lic. Marco Antonio Quispe (Técnico de Redes)',
        fecha: 'Hoy, 09:15 AM',
        descripcion: 'Técnico ha iniciado pruebas de reflectometría en el switch principal del piso 3.',
        color: 'var(--color-accent)'
      },
      {
        titulo: 'Asignación Operativa',
        autor: 'Supervisor Carlos Huanca',
        fecha: 'Hoy, 08:30 AM',
        descripcion: 'Supervisor asignó el caso formalmente a la unidad de Redes y Telecomunicaciones.',
        color: 'var(--color-status-asignado)'
      }
    ]
  },
  {
    id: 'CAS-2026-0089',
    codigo: 'CAS-2026-0089',
    titulo: 'Mantenimiento de computadoras y catastro distrital',
    solicitanteId: 'usr-004',
    solicitanteNombre: 'Lic. Ana María Mendoza',
    origen: 'Dirección de Catastro y Administración Territorial',
    destino: 'Subalcaldía Distrito 3 (Pacajes / Villa Adela)',
    dependenciaActualId: 'SUBALCALDIA-D3',
    responsable: 'Ing. Pedro Mamani Huanca',
    prioridad: 'MEDIA',
    estado: 'EN_DERIVACION',
    slaRestante: '5h restantes',
    distrito: 3,
    descripcion: 'Solicitud de revisión preventiva para 8 terminales que procesan catastros vecinales en la Subalcaldía del Distrito 3.',
    novedades: [
      {
        titulo: 'Derivación Inter-Oficinas',
        autor: 'Dirección de Catastro',
        fecha: 'Hoy, 07:45 AM',
        descripcion: 'Se deriva expediente a la Subalcaldía del Distrito 3 para verificación técnica de equipos en sede distrital.',
        color: 'var(--color-status-derivacion)'
      }
    ]
  },
  {
    id: 'CAS-2026-0092',
    codigo: 'CAS-2026-0092',
    titulo: 'Inspección de bacheo y luminarias en avenida principal',
    solicitanteId: 'usr-005',
    solicitanteNombre: 'Ing. David Choque Quisbert',
    origen: 'Subalcaldía Distrito 8 (Senkata)',
    destino: 'Dirección de Infraestructura Pública',
    dependenciaActualId: 'DIR-INFRAESTRUCTURA',
    responsable: 'Ing. Jaime Morales',
    prioridad: 'URGENTE',
    estado: 'EN_PROCESO',
    slaRestante: '1h 15m restante',
    distrito: 8,
    descripcion: 'Coordinación inter-institucional para despliegue de maquinaria y cuadrilla técnica en el Distrito 8.',
    novedades: [
      {
        titulo: 'Recepción y Programación de Cuadrilla',
        autor: 'Dirección de Infraestructura Pública',
        fecha: 'Hoy, 10:00 AM',
        descripcion: 'Cuadrilla número 4 programada para intervención inmediata.',
        color: 'var(--color-status-proceso)'
      }
    ]
  }
];

export class FileCasoRepository {
  private filePath: string;

  constructor(customPath?: string) {
    const dataDir = customPath ? path.dirname(customPath) : path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = customPath || path.join(dataDir, 'cases.json');
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    if (!fs.existsSync(this.filePath)) {
      this.writeCases(DEFAULT_CASES);
    }
  }

  private readCases(): CasoRecord[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.writeCases(DEFAULT_CASES);
        return DEFAULT_CASES;
      }
      const data = fs.readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return DEFAULT_CASES;
    } catch (err) {
      console.error('[FileCasoRepository] Error leyendo archivo de casos:', err);
      return DEFAULT_CASES;
    }
  }

  private writeCases(cases: CasoRecord[]): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(cases, null, 2), 'utf8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('[FileCasoRepository] Error escribiendo archivo de casos:', err);
    }
  }

  public getAll(): CasoRecord[] {
    return this.readCases();
  }

  public getById(id: string): CasoRecord | undefined {
    const list = this.readCases();
    return list.find(c => c.id === id || c.codigo === id);
  }

  public create(newCase: CasoRecord): CasoRecord {
    const list = this.readCases();
    const nowIso = new Date().toISOString();
    const record: CasoRecord = {
      ...newCase,
      createdAt: newCase.createdAt || nowIso,
      updatedAt: nowIso
    };
    list.unshift(record);
    this.writeCases(list);
    return record;
  }

  public update(id: string, updates: Partial<CasoRecord>): CasoRecord | null {
    const list = this.readCases();
    const index = list.findIndex(c => c.id === id || c.codigo === id);
    if (index === -1) return null;

    const existing = list[index];
    const updated: CasoRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    this.writeCases(list);
    return updated;
  }

  public addNovedad(casoId: string, novedad: NovedadRecord): CasoRecord | null {
    const list = this.readCases();
    const index = list.findIndex(c => c.id === casoId || c.codigo === casoId);
    if (index === -1) return null;

    const caso = list[index];
    if (!Array.isArray(caso.novedades)) {
      caso.novedades = [];
    }
    caso.novedades.unshift(novedad);
    caso.updatedAt = new Date().toISOString();
    list[index] = caso;
    this.writeCases(list);
    return caso;
  }

  public derivar(casoId: string, destino: string, motivo: string, autor: string): CasoRecord | null {
    const list = this.readCases();
    const index = list.findIndex(c => c.id === casoId || c.codigo === casoId);
    if (index === -1) return null;

    const caso = list[index];
    caso.estado = 'EN_DERIVACION';
    caso.destino = destino;
    caso.dependenciaActualId = destino;
    if (destino.includes('SUBALCALDIA')) {
      const distNum = parseInt(destino.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(distNum)) caso.distrito = distNum;
    }
    if (!Array.isArray(caso.novedades)) caso.novedades = [];
    caso.novedades.unshift({
      titulo: `Derivación formal a ${destino}`,
      autor: autor,
      fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      descripcion: motivo,
      color: 'var(--color-status-derivacion)'
    });
    caso.updatedAt = new Date().toISOString();
    list[index] = caso;
    this.writeCases(list);
    return caso;
  }

  public resolver(casoId: string, solucion: string, autor: string): CasoRecord | null {
    const list = this.readCases();
    const index = list.findIndex(c => c.id === casoId || c.codigo === casoId);
    if (index === -1) return null;

    const caso = list[index];
    caso.estado = 'RESUELTO';
    if (!Array.isArray(caso.novedades)) caso.novedades = [];
    caso.novedades.unshift({
      titulo: 'Resolución Operativa del Requerimiento',
      autor: autor,
      fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      descripcion: solucion,
      color: 'var(--color-status-resuelto)'
    });
    caso.updatedAt = new Date().toISOString();
    list[index] = caso;
    this.writeCases(list);
    return caso;
  }
}
