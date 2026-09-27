import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { FileCasoRepository, CasoRecord } from '../infrastructure/persistence/FileCasoRepository.js';

// Carga simple y sin dependencias de variables de entorno desde .env si existe
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const PORT = process.env.PORT || 3000;
const WEB_DIR = path.join(process.cwd(), 'src/web');
const casoRepo = new FileCasoRepository();

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method || 'GET';

  // Manejo de Preflight CORS
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Manejo de favicon para evitar 404 en navegadores
  if (pathname === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Endpoint de Salud
  if (pathname === '/api/v1/health') {
    sendJson(res, 200, {
      status: 'HEALTHY',
      institucion: 'Gobierno Autónomo Municipal de El Alto — GAMEA',
      version: '1.0.0',
      storage: 'PERSISTENT_FILE_CASES'
    });
    return;
  }

  // Endpoint de Configuración Agente (.env)
  if (pathname === '/api/v1/config/agent' && method === 'GET') {
    const hasKey = !!process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.length > 5;
    sendJson(res, 200, {
      hasServerApiKey: hasKey,
      defaultModel: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free',
      keyPreview: hasKey ? `${process.env.OPENROUTER_API_KEY!.substring(0, 10)}...` : ''
    });
    return;
  }

  // Proxy Agente OpenRouter
  if (pathname === '/api/v1/agent/chat' && method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      const apiKey = payload.apiKey || process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        sendJson(res, 400, { error: { message: 'No se configuró clave OPENROUTER_API_KEY en .env ni en el panel.' } });
        return;
      }

      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://soporte.elalto.gob.bo',
          'X-Title': 'GAMEA Soporte Interno'
        },
        body: JSON.stringify({
          model: payload.model || process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free',
          temperature: payload.temperature ?? 0.3,
          messages: payload.messages || []
        })
      });

      const data = await openRouterRes.text();
      res.writeHead(openRouterRes.status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } catch (err: any) {
      sendJson(res, 500, { error: { message: err?.message || 'Error al conectar con OpenRouter' } });
    }
    return;
  }

  // ==========================================================================
  // API REST: CRUD DE CASOS EN ATENCIÓN (Persistencia en Base de Datos/Disco)
  // ==========================================================================

  // 1. GET /api/v1/cases - Obtener todos los casos persistidos
  if (pathname === '/api/v1/cases' && method === 'GET') {
    const cases = casoRepo.getAll();
    sendJson(res, 200, cases);
    return;
  }

  // 2. POST /api/v1/cases - Registrar nuevo caso y persistir
  if (pathname === '/api/v1/cases' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      if (!body.titulo || !body.descripcion || !body.solicitanteNombre) {
        sendJson(res, 400, { error: 'Faltan campos obligatorios: titulo, descripcion o solicitanteNombre' });
        return;
      }

      const existingCases = casoRepo.getAll();
      const nextNum = 100 + existingCases.length;
      const nuevoId = body.id || body.codigo || `CAS-2026-0${nextNum}`;

      const nuevoCaso: CasoRecord = {
        id: nuevoId,
        codigo: nuevoId,
        titulo: body.titulo,
        solicitanteId: body.solicitanteId || 'usr-anon',
        solicitanteNombre: body.solicitanteNombre,
        origen: body.origen || 'Unidad Solicitante',
        destino: body.destino || 'DIR-TECNOLOGIAS-INF',
        dependenciaActualId: body.dependenciaActualId || body.destino || 'DIR-TECNOLOGIAS-INF',
        responsable: body.responsable || 'Sin Asignar (Bandeja de Entrada)',
        prioridad: body.prioridad || 'MEDIA',
        estado: body.estado || 'REGISTRADO',
        slaRestante: body.slaRestante || '4h restantes',
        distrito: body.distrito !== undefined ? body.distrito : (body.destino && body.destino.includes('SUBALCALDIA') ? parseInt(body.destino.replace(/[^0-9]/g, ''), 10) || null : null),
        descripcion: body.descripcion,
        novedades: Array.isArray(body.novedades) && body.novedades.length > 0 ? body.novedades : [
          {
            titulo: 'Registro Formal de Requerimiento',
            autor: body.solicitanteNombre,
            fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
            descripcion: body.descripcion,
            color: 'var(--color-status-registrado)'
          }
        ]
      };

      const creado = casoRepo.create(nuevoCaso);
      sendJson(res, 201, creado);
    } catch (err: any) {
      sendJson(res, 500, { error: err?.message || 'Error al persistir el nuevo caso' });
    }
    return;
  }

  // 3. POST /api/v1/cases/:id/novedades - Agregar novedad a la cronología
  const matchNovedad = pathname.match(/^\/api\/v1\/cases\/([^/]+)\/novedades$/);
  if (matchNovedad && method === 'POST') {
    try {
      const casoId = decodeURIComponent(matchNovedad[1]);
      const body = await parseJsonBody(req);
      if (!body.titulo || !body.descripcion) {
        sendJson(res, 400, { error: 'Campos requeridos: titulo y descripcion' });
        return;
      }
      const novedad = {
        titulo: body.titulo,
        autor: body.autor || 'Funcionario Técnico GAMEA',
        fecha: body.fecha || new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        descripcion: body.descripcion,
        color: body.color || 'var(--color-accent)'
      };
      const actualizado = casoRepo.addNovedad(casoId, novedad);
      if (!actualizado) {
        sendJson(res, 404, { error: `Caso ${casoId} no encontrado` });
        return;
      }
      sendJson(res, 200, actualizado);
    } catch (err: any) {
      sendJson(res, 500, { error: err?.message || 'Error al agregar la novedad' });
    }
    return;
  }

  // 4. POST /api/v1/cases/:id/derivar - Derivación formal del caso
  const matchDerivar = pathname.match(/^\/api\/v1\/cases\/([^/]+)\/derivar$/);
  if (matchDerivar && method === 'POST') {
    try {
      const casoId = decodeURIComponent(matchDerivar[1]);
      const body = await parseJsonBody(req);
      if (!body.destino || !body.motivo) {
        sendJson(res, 400, { error: 'Campos requeridos: destino y motivo' });
        return;
      }
      const actualizado = casoRepo.derivar(
        casoId,
        body.destino,
        body.motivo,
        body.autor || 'Lic. Marco Antonio Quispe'
      );
      if (!actualizado) {
        sendJson(res, 404, { error: `Caso ${casoId} no encontrado` });
        return;
      }
      sendJson(res, 200, actualizado);
    } catch (err: any) {
      sendJson(res, 500, { error: err?.message || 'Error al derivar el caso' });
    }
    return;
  }

  // 5. POST /api/v1/cases/:id/resolver - Resolución técnica del caso
  const matchResolver = pathname.match(/^\/api\/v1\/cases\/([^/]+)\/resolver$/);
  if (matchResolver && method === 'POST') {
    try {
      const casoId = decodeURIComponent(matchResolver[1]);
      const body = await parseJsonBody(req);
      if (!body.solucion) {
        sendJson(res, 400, { error: 'Campo requerido: solucion' });
        return;
      }
      const actualizado = casoRepo.resolver(
        casoId,
        body.solucion,
        body.autor || 'Lic. Marco Antonio Quispe'
      );
      if (!actualizado) {
        sendJson(res, 404, { error: `Caso ${casoId} no encontrado` });
        return;
      }
      sendJson(res, 200, actualizado);
    } catch (err: any) {
      sendJson(res, 500, { error: err?.message || 'Error al resolver el caso' });
    }
    return;
  }

  // 6. GET /api/v1/cases/:id - Obtener detalle de un caso específico
  const matchCasoSingle = pathname.match(/^\/api\/v1\/cases\/([^/]+)$/);
  if (matchCasoSingle && method === 'GET') {
    const casoId = decodeURIComponent(matchCasoSingle[1]);
    const caso = casoRepo.getById(casoId);
    if (!caso) {
      sendJson(res, 404, { error: `Caso ${casoId} no encontrado` });
      return;
    }
    sendJson(res, 200, caso);
    return;
  }

  // Servicio de archivos estáticos de la interfaz web
  let reqPath = pathname === '/' ? 'index.html' : pathname;
  let filePath = path.join(WEB_DIR, reqPath);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Recurso no encontrado en el servidor institucional GAMEA');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error interno del servidor');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[GAMEA] Plataforma Interna de Gestión y Soporte ejecutándose en http://localhost:${PORT}`);
});
