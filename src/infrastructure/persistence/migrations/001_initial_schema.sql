-- ============================================================================
-- GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO — GAMEA
-- Esquema Relacional de Base de Datos Soberano (PostgreSQL 16)
-- Módulo: Plataforma Interna de Gestión, Soporte y Casos
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Catálogo Organizacional y Subalcaldías
CREATE TABLE dependencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(64) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(32) NOT NULL, -- DESPACHO, SECRETARIA, DIRECCION, UNIDAD, SUBALCALDIA
    dependencia_padre_id UUID REFERENCES dependencias(id) ON DELETE RESTRICT,
    es_subalcaldia BOOLEAN NOT NULL DEFAULT FALSE,
    distrito_municipal INTEGER, -- 1 al 14 para las Subalcaldías de El Alto
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Directorio Institucional de Servidores Públicos
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    carnet_identidad VARCHAR(32) UNIQUE NOT NULL,
    nombres VARCHAR(128) NOT NULL,
    apellidos VARCHAR(128) NOT NULL,
    email_institucional VARCHAR(128) UNIQUE NOT NULL,
    cargo VARCHAR(128) NOT NULL,
    dependencia_id UUID NOT NULL REFERENCES dependencias(id),
    rol VARCHAR(32) NOT NULL, -- SOLICITANTE, FUNCIONARIO_TECNICO, SUPERVISOR_UNIDAD, etc.
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Entidad Central: Casos Internos
CREATE TABLE casos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_caso VARCHAR(32) UNIQUE NOT NULL,
    solicitante_id UUID NOT NULL REFERENCES usuarios(id),
    dependencia_origen_id UUID NOT NULL REFERENCES dependencias(id),
    dependencia_actual_id UUID NOT NULL REFERENCES dependencias(id),
    responsable_actual_id UUID REFERENCES usuarios(id),
    categoria_servicio VARCHAR(64) NOT NULL,
    prioridad VARCHAR(32) NOT NULL, -- BAJA, MEDIA, ALTA, URGENTE, CRITICA_INSTITUCIONAL
    estado VARCHAR(32) NOT NULL, -- REGISTRADO, ASIGNADO, EN_PROCESO, EN_DERIVACION, etc.
    asunto VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    sensibilidad VARCHAR(32) NOT NULL DEFAULT 'OPERATIVA',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    fecha_cierre TIMESTAMP WITH TIME ZONE
);

-- 4. Novedades Institucionales (Registro Cronológico de Hitos)
CREATE TABLE novedades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caso_id UUID NOT NULL REFERENCES casos(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES usuarios(id),
    tipo VARCHAR(32) NOT NULL, -- OBSERVACION, AVANCE, INCIDENCIA, COMPROMISO, DERIVACION, etc.
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado_resultante VARCHAR(32),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Derivaciones Inter-Oficinas (Traspaso Formal de Custodia Operativa)
CREATE TABLE derivaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caso_id UUID NOT NULL REFERENCES casos(id) ON DELETE CASCADE,
    dependencia_origen_id UUID NOT NULL REFERENCES dependencias(id),
    dependencia_destino_id UUID NOT NULL REFERENCES dependencias(id),
    funcionario_remitente_id UUID NOT NULL REFERENCES usuarios(id),
    funcionario_receptor_id UUID REFERENCES usuarios(id),
    motivo_derivacion TEXT NOT NULL,
    prioridad VARCHAR(32) NOT NULL,
    estado VARCHAR(32) NOT NULL DEFAULT 'SOLICITADA', -- SOLICITADA, ACEPTADA, RECHAZADA
    fecha_derivacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_recepcion TIMESTAMP WITH TIME ZONE,
    fecha_conclusion TIMESTAMP WITH TIME ZONE,
    observaciones_respuesta TEXT
);

-- 6. Comentarios y Coordinación Tri-Tier
CREATE TABLE comentarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caso_id UUID NOT NULL REFERENCES casos(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES usuarios(id),
    visibilidad VARCHAR(32) NOT NULL, -- COMUNICACION_SOLICITANTE, COMUNICACION_INTERNA, NOTA_PRIVADA
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Registro Forense de Auditoría Append-Only (Inmutable)
CREATE TABLE auditoria_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caso_id UUID REFERENCES casos(id) ON DELETE SET NULL,
    actor_id UUID NOT NULL REFERENCES usuarios(id),
    accion VARCHAR(64) NOT NULL,
    entidad_afectada VARCHAR(64) NOT NULL,
    entidad_id VARCHAR(64) NOT NULL,
    valor_anterior JSONB,
    valor_nuevo JSONB,
    justificacion TEXT NOT NULL,
    ip_origen VARCHAR(45),
    fecha_evento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TRIGGER DE SEGURIDAD PARA AUDITORÍA INMUTABLE: PROHIBE CUALQUIER UPDATE O DELETE
CREATE OR REPLACE FUNCTION trg_prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'VIOLACION CONSTITUCIONAL: La tabla auditoria_logs es estrictamente inmutable (append-only). No se permiten modificaciones ni eliminaciones.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_no_tampering
BEFORE UPDATE OR DELETE ON auditoria_logs
FOR EACH ROW EXECUTE FUNCTION trg_prevent_audit_tampering();

-- ÍNDICES DE RENDIMIENTO Y FILTRADO DISTRITAL
CREATE INDEX idx_casos_dependencia_actual ON casos(dependencia_actual_id);
CREATE INDEX idx_casos_responsable_actual ON casos(responsable_actual_id);
CREATE INDEX idx_casos_estado ON casos(estado);
CREATE INDEX idx_dependencias_subalcaldia ON dependencias(es_subalcaldia, distrito_municipal);
CREATE INDEX idx_novedades_caso_cronologico ON novedades(caso_id, fecha_registro ASC);
CREATE INDEX idx_derivaciones_caso ON derivaciones(caso_id);
CREATE INDEX idx_auditoria_caso ON auditoria_logs(caso_id, fecha_evento ASC);
