// Datos del negocio de demostración.
// Para adaptar los agentes a un cliente real, sólo hay que cambiar este archivo.

export const negocio = {
  nombre: 'Estudio Contable Demo',
  rubro: 'Estudio contable para monotributistas, autónomos y pymes en Argentina',

  servicios: [
    { nombre: 'Alta de monotributo', precio: 'desde $45.000 (pago único)' },
    { nombre: 'Gestión mensual de monotributo', precio: '$35.000 por mes' },
    { nombre: 'Liquidación de sueldos', precio: '$12.000 por empleado por mes' },
    { nombre: 'Contabilidad para pymes', precio: 'desde $180.000 por mes, según volumen' },
    { nombre: 'Declaración de Ganancias y Bienes Personales', precio: 'desde $90.000 por año' },
  ],

  horario: 'Lunes a viernes de 9 a 18 h. Atención presencial con turno y también online.',
  contacto: 'WhatsApp +54 11 0000-0000 · hola@estudiodemo.com.ar',

  // Cómo decide el calificador qué tan "caliente" es un lead.
  criterios: {
    caliente: 'Necesita un servicio concreto que ofrecemos, tiene urgencia o fecha límite, o pide presupuesto o una reunión.',
    tibio: 'Tiene una necesidad real pero sin urgencia, o está comparando opciones y pide información general.',
    frio: 'Consulta muy vaga, fuera de nuestros servicios, sólo busca información gratis, o es spam o publicidad.',
  },
};

// Texto del negocio para incluir en las instrucciones de los agentes.
export function describirNegocio() {
  const servicios = negocio.servicios.map(s => `- ${s.nombre}: ${s.precio}`).join('\n');
  return `Negocio: ${negocio.nombre}
Rubro: ${negocio.rubro}
Servicios y precios:
${servicios}
Horario: ${negocio.horario}
Contacto: ${negocio.contacto}`;
}
