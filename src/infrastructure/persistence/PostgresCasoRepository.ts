import pg from 'pg';
import { CasoRecord, NovedadRecord } from './FileCasoRepository.js';

const { Pool } = pg;

export class PostgresCasoRepository {
  private pool: pg.Pool;
  private isInitialized = false;

  constructor(connectionString?: string) {
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
    });
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS casos_almacenados (
        id VARCHAR(64) PRIMARY KEY,
        codigo VARCHAR(64) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        solicitante_id VARCHAR(64),
        solicitante_nombre VARCHAR(255) NOT NULL,
        origen VARCHAR(255) NOT NULL,
        destino VARCHAR(255) NOT NULL,
        dependencia_actual_id VARCHAR(64) NOT NULL,
        responsable VARCHAR(255) NOT NULL,
        prioridad VARCHAR(32) NOT NULL,
        estado VARCHAR(32) NOT NULL,
        sla_restante VARCHAR(64) NOT NULL,
        distrito INTEGER,
        descripcion TEXT NOT NULL,
        novedades JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.pool.query(createTableQuery);

      // Verificar si hay casos iniciales, si no, poblar con los iniciales
      const countRes = await this.pool.query('SELECT COUNT(*) FROM casos_almacenados');
      if (parseInt(countRes.rows[0].count, 10) === 0) {
        await this.seedInitialCases();
      }

      this.isInitialized = true;
      console.log('[PostgresCasoRepository] Conexión y tablas de PostgreSQL verificadas exitosamente.');
    } catch (err) {
      console.error('[PostgresCasoRepository] Error inicializando base de datos PostgreSQL:', err);
      throw err;
    }
  }

  private async seedInitialCases(): Promise<void> {
    const initialCases: CasoRecord[] = [
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

    for (const c of initialCases) {
      await this.create(c);
    }
  }

  public async getAll(): Promise<CasoRecord[]> {
    await this.init();
    const res = await this.pool.query(
      'SELECT * FROM casos_almacenados ORDER BY created_at DESC'
    );
    return res.rows.map(this.mapRowToRecord);
  }

  public async getById(id: string): Promise<CasoRecord | null> {
    await this.init();
    const res = await this.pool.query(
      'SELECT * FROM casos_almacenados WHERE id = $1 OR codigo = $1 LIMIT 1',
      [id]
    );
    if (res.rows.length === 0) return null;
    return this.mapRowToRecord(res.rows[0]);
  }

  public async create(record: CasoRecord): Promise<CasoRecord> {
    await this.init();
    const query = `
      INSERT INTO casos_almacenados (
        id, codigo, titulo, solicitante_id, solicitante_nombre, origen, destino,
        dependencia_actual_id, responsable, prioridad, estado, sla_restante,
        distrito, descripcion, novedades, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      record.id,
      record.codigo,
      record.titulo,
      record.solicitanteId,
      record.solicitanteNombre,
      record.origen,
      record.destino,
      record.dependenciaActualId,
      record.responsable,
      record.prioridad,
      record.estado,
      record.slaRestante,
      record.distrito,
      record.descripcion,
      JSON.stringify(record.novedades || [])
    ]);
    return this.mapRowToRecord(res.rows[0]);
  }

  public async addNovedad(casoId: string, novedad: NovedadRecord): Promise<CasoRecord | null> {
    await this.init();
    const current = await this.getById(casoId);
    if (!current) return null;

    const novedades = Array.isArray(current.novedades) ? [novedad, ...current.novedades] : [novedad];
    const res = await this.pool.query(
      `UPDATE casos_almacenados
       SET novedades = $1, updated_at = NOW()
       WHERE id = $2 OR codigo = $2
       RETURNING *;`,
      [JSON.stringify(novedades), casoId]
    );
    return res.rows.length > 0 ? this.mapRowToRecord(res.rows[0]) : null;
  }

  public async derivar(casoId: string, destino: string, motivo: string, autor: string): Promise<CasoRecord | null> {
    await this.init();
    const current = await this.getById(casoId);
    if (!current) return null;

    let distrito = current.distrito;
    if (destino.includes('SUBALCALDIA')) {
      const distNum = parseInt(destino.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(distNum)) distrito = distNum;
    }

    const novedad: NovedadRecord = {
      titulo: `Derivación formal a ${destino}`,
      autor: autor,
      fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      descripcion: motivo,
      color: 'var(--color-status-derivacion)'
    };
    const novedades = Array.isArray(current.novedades) ? [novedad, ...current.novedades] : [novedad];

    const res = await this.pool.query(
      `UPDATE casos_almacenados
       SET estado = 'EN_DERIVACION',
           destino = $1,
           dependencia_actual_id = $1,
           distrito = $2,
           novedades = $3,
           updated_at = NOW()
       WHERE id = $4 OR codigo = $4
       RETURNING *;`,
      [destino, distrito, JSON.stringify(novedades), casoId]
    );
    return res.rows.length > 0 ? this.mapRowToRecord(res.rows[0]) : null;
  }

  public async resolver(casoId: string, solucion: string, autor: string): Promise<CasoRecord | null> {
    await this.init();
    const current = await this.getById(casoId);
    if (!current) return null;

    const novedad: NovedadRecord = {
      titulo: 'Resolución Operativa del Requerimiento',
      autor: autor,
      fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      descripcion: solucion,
      color: 'var(--color-status-resuelto)'
    };
    const novedades = Array.isArray(current.novedades) ? [novedad, ...current.novedades] : [novedad];

    const res = await this.pool.query(
      `UPDATE casos_almacenados
       SET estado = 'RESUELTO',
           novedades = $1,
           updated_at = NOW()
       WHERE id = $2 OR codigo = $2
       RETURNING *;`,
      [JSON.stringify(novedades), casoId]
    );
    return res.rows.length > 0 ? this.mapRowToRecord(res.rows[0]) : null;
  }

  private mapRowToRecord(row: any): CasoRecord {
    return {
      id: row.id,
      codigo: row.codigo,
      titulo: row.titulo,
      solicitanteId: row.solicitante_id,
      solicitanteNombre: row.solicitante_nombre,
      origen: row.origen,
      destino: row.destino,
      dependenciaActualId: row.dependencia_actual_id,
      responsable: row.responsable,
      prioridad: row.prioridad,
      estado: row.estado,
      slaRestante: row.sla_restante,
      distrito: row.distrito,
      descripcion: row.descripcion,
      novedades: typeof row.novedades === 'string' ? JSON.parse(row.novedades) : (row.novedades || []),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined
    };
  }
}
