import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // Manejo de endpoints API básicos
  if (req.url === '/api/v1/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'HEALTHY', institucion: 'GAMEA', version: '1.0.0' }));
    return;
  }

  // Endpoint para obtener configuración institucional del agente (.env)
  if (req.url === '/api/v1/config/agent' && req.method === 'GET') {
    const hasKey = !!process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.length > 5;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      hasServerApiKey: hasKey,
      defaultModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
      keyPreview: hasKey ? `${process.env.OPENROUTER_API_KEY!.substring(0, 10)}...` : ''
    }));
    return;
  }

  // Proxy seguro opcional para llamadas a OpenRouter usando la clave del .env si no se provee en cliente
  if (req.url === '/api/v1/agent/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const apiKey = payload.apiKey || process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: 'No se configuró clave OPENROUTER_API_KEY en .env ni en el panel.' } }));
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
            model: payload.model || process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
            temperature: payload.temperature ?? 0.3,
            messages: payload.messages || []
          })
        });

        const data = await openRouterRes.text();
        res.writeHead(openRouterRes.status, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: err?.message || 'Error al conectar con OpenRouter' } }));
      }
    });
    return;
  }

  // Servicio de archivos estáticos de la interfaz web
  let filePath = path.join(WEB_DIR, req.url === '/' ? 'index.html' : req.url || 'index.html');
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Recurso no encontrado en el servidor institucional GAMEA');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
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
