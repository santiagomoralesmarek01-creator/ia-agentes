// Servidor para probar en tu compu sin instalar nada de Vercel.
// Uso: ANTHROPIC_API_KEY=... npm run dev   →  abrir http://localhost:3000

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import calificar from '../api/calificar.js';

const PUERTO = process.env.PORT || 3000;
const RAIZ = process.cwd();
const RUTAS_API = { '/api/calificar': calificar };
const TIPOS = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };

createServer(async (req, res) => {
  const ruta = new URL(req.url, 'http://localhost').pathname;

  const api = RUTAS_API[ruta];
  if (api) {
    let cuerpo = '';
    for await (const parte of req) cuerpo += parte;
    try {
      req.body = cuerpo ? JSON.parse(cuerpo) : {};
    } catch {
      req.body = {};
    }
    // Imita los atajos que Vercel agrega a la respuesta.
    res.status = codigo => { res.statusCode = codigo; return res; };
    res.json = datos => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(datos));
    };
    return api(req, res);
  }

  const archivo = normalize(join(RAIZ, ruta === '/' ? 'index.html' : ruta));
  if (!archivo.startsWith(RAIZ) || archivo.includes('node_modules')) {
    res.statusCode = 404;
    return res.end('No encontrado');
  }
  try {
    const contenido = await readFile(archivo);
    res.setHeader('Content-Type', TIPOS[extname(archivo)] || 'application/octet-stream');
    res.end(contenido);
  } catch {
    res.statusCode = 404;
    res.end('No encontrado');
  }
}).listen(PUERTO, () => console.log(`Abrí http://localhost:${PUERTO}`));
