// Lógica de la página: manda la consulta a /api/calificar y muestra el resultado.

import { EJEMPLOS } from '/lib/ejemplos.js';

const $ = id => document.getElementById(id);
const formulario = $('formulario');
const consulta = $('consulta');
const boton = $('boton');
const error = $('error');
const resultado = $('resultado');

const ETIQUETAS = { caliente: 'Caliente', tibio: 'Tibio', frio: 'Frío' };

for (const ejemplo of EJEMPLOS) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = ejemplo.titulo;
  b.addEventListener('click', () => {
    consulta.value = ejemplo.consulta;
    consulta.focus();
  });
  $('ejemplos').append(b);
}

formulario.addEventListener('submit', async evento => {
  evento.preventDefault();
  error.hidden = true;
  resultado.hidden = true;
  boton.disabled = true;
  boton.textContent = 'Calificando…';

  try {
    const respuesta = await fetch('/api/calificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consulta: consulta.value }),
    });
    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) throw new Error(datos.error || 'No se pudo calificar la consulta.');
    mostrar(datos);
  } catch (e) {
    error.textContent = e.message;
    error.hidden = false;
  } finally {
    boton.disabled = false;
    boton.textContent = 'Calificar';
  }
});

function mostrar(r) {
  const temperatura = $('temperatura');
  temperatura.textContent = ETIQUETAS[r.temperatura] ?? r.temperatura;
  temperatura.className = `temperatura ${r.temperatura}`;
  $('puntaje').textContent = `${r.puntaje}/100`;
  $('urgencia').textContent = `Urgencia ${r.urgencia}`;
  $('motivo').textContent = r.motivo;
  $('necesidad').textContent = r.necesidad;
  $('servicio').textContent = r.servicio_sugerido;
  $('contacto').textContent = Object.values(r.contacto).filter(Boolean).join(' · ') || 'Sin datos';
  $('siguiente').textContent = r.siguiente_paso;
  $('borrador').textContent = r.borrador_respuesta;
  resultado.hidden = false;
}

$('copiar').addEventListener('click', async () => {
  await navigator.clipboard.writeText($('borrador').textContent);
  $('copiar').textContent = '¡Copiado!';
  setTimeout(() => { $('copiar').textContent = 'Copiar'; }, 1500);
});
