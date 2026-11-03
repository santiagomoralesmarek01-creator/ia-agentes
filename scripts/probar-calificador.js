// Prueba el calificador con consultas de ejemplo, desde la terminal.
// Uso: ANTHROPIC_API_KEY=... npm run probar
// Cada consulta es una llamada real a la API de Claude (tiene un costo mínimo).

import { calificarConsulta } from '../lib/calificador.js';
import { EJEMPLOS } from '../lib/ejemplos.js';

for (const ejemplo of EJEMPLOS) {
  console.log(`\n=== ${ejemplo.titulo} ===`);
  try {
    const r = await calificarConsulta(ejemplo.consulta);
    console.log(`${r.temperatura.toUpperCase()} (${r.puntaje}/100) · urgencia ${r.urgencia}`);
    console.log(`Motivo: ${r.motivo}`);
    console.log(`Servicio: ${r.servicio_sugerido}`);
    console.log(`Siguiente paso: ${r.siguiente_paso}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}
