// Endpoint POST /api/calificar
// Recibe { "consulta": "texto" } y devuelve la clasificación del lead.
// Vercel convierte cada archivo de la carpeta api/ en una función del servidor.

import Anthropic from '@anthropic-ai/sdk';
import { calificarConsulta, ErrorCalificador } from '../lib/calificador.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Usá POST.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Falta la variable de entorno ANTHROPIC_API_KEY');
    return res.status(500).json({ error: 'El servidor no está configurado: falta la clave de la API de Claude.' });
  }

  try {
    const resultado = await calificarConsulta(req.body?.consulta);
    return res.status(200).json(resultado);
  } catch (error) {
    if (error instanceof ErrorCalificador) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Falta o es inválida la ANTHROPIC_API_KEY');
      return res.status(500).json({ error: 'El servidor no está configurado. Revisá la clave de la API.' });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'Hay muchas consultas al mismo tiempo. Probá de nuevo en un minuto.' });
    }
    console.error(error);
    return res.status(502).json({ error: 'No se pudo calificar la consulta. Probá de nuevo.' });
  }
}
