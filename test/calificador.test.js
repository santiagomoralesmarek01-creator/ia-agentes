// Pruebas del calificador con un cliente falso: no llaman a la API ni gastan tokens.
// Uso: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calificarConsulta, ErrorCalificador } from '../lib/calificador.js';

const RESULTADO = {
  temperatura: 'caliente',
  puntaje: 140,
  motivo: 'Pide presupuesto con fecha límite.',
  necesidad: 'Liquidación de sueldos',
  servicio_sugerido: 'Liquidación de sueldos',
  urgencia: 'alta',
  contacto: { nombre: 'Martina', email: '', telefono: '11 5555-1234', empresa: 'La Espiga' },
  siguiente_paso: 'Llamar hoy.',
  borrador_respuesta: 'Hola Martina...',
};

function clienteFalso(respuesta) {
  const llamadas = [];
  return {
    llamadas,
    beta: {
      messages: {
        create: async pedido => {
          llamadas.push(pedido);
          return respuesta;
        },
      },
    },
  };
}

test('devuelve el JSON de Claude y limita el puntaje a 0-100', async () => {
  const cliente = clienteFalso({
    stop_reason: 'end_turn',
    content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: JSON.stringify(RESULTADO) }],
  });
  const r = await calificarConsulta('Necesito un contador', { cliente });
  assert.equal(r.temperatura, 'caliente');
  assert.equal(r.puntaje, 100);

  const pedido = cliente.llamadas[0];
  assert.equal(pedido.model, 'claude-opus-5-5');
  assert.equal(pedido.output_config.format.type, 'json_schema');
  assert.equal(pedido.fallbacks, 'default');
  assert.match(pedido.messages[0].content, /Necesito un contador/);
});

test('rechaza consultas vacías o demasiado largas sin llamar a la API', async () => {
  const cliente = clienteFalso({});
  await assert.rejects(calificarConsulta('   ', { cliente }), ErrorCalificador);
  await assert.rejects(calificarConsulta('a'.repeat(8001), { cliente }), ErrorCalificador);
  assert.equal(cliente.llamadas.length, 0);
});

test('avisa si el modelo se niega o la respuesta queda cortada', async () => {
  await assert.rejects(
    calificarConsulta('hola', { cliente: clienteFalso({ stop_reason: 'refusal', content: [] }) }),
    /no quiso/,
  );
  await assert.rejects(
    calificarConsulta('hola', { cliente: clienteFalso({ stop_reason: 'max_tokens', content: [] }) }),
    /cortada/,
  );
});
