# Agentes de IA para negocios

Tres agentes que comparten la misma base, pensados como demo vendible y adaptable a cada cliente:

| # | Agente | Estado |
|---|---|---|
| 9 | **Calificador de leads**: lee una consulta y dice si el lead es caliente, tibio o frío, por qué, y prepara una respuesta | ✅ Paso 1 listo |
| 8 | **Atención al cliente**: chat web que responde con la información del negocio y deriva a una persona | ⏳ Próximo |
| 10 | **Lector de documentos**: extrae datos de facturas, presupuestos o formularios (PDF o foto) | ⏳ Después |

El negocio de ejemplo es un estudio contable inventado (**Estudio Contable Demo**). Para adaptarlo a un cliente real se cambia sólo `lib/negocio.js`.

## Cómo funciona el calificador

```
Página (index.html + app.js)
   │  el usuario pega una consulta
   ▼
POST /api/calificar  (api/calificar.js, función del servidor en Vercel)
   │
   ▼
lib/calificador.js
   │  arma las instrucciones con los datos del negocio (lib/negocio.js)
   │  y le pide a Claude una respuesta con un formato fijo (JSON)
   ▼
API de Claude  →  { temperatura, puntaje, motivo, servicio_sugerido, borrador_respuesta, ... }
```

- La **clave de la API** sólo vive en el servidor (variable `ANTHROPIC_API_KEY`). Nunca llega al navegador.
- La respuesta tiene un **esquema fijo**: la API garantiza que siempre vuelvan los mismos campos, así la página no se rompe.
- Usa `claude-haiku-5-5`, el modelo más económico de Claude, con esfuerzo bajo (`effort: 'low'`), porque clasificar es una tarea simple. Si alguna vez la calidad no alcanza, se cambia el modelo en `lib/calificador.js` (por ejemplo a `claude-sonnet-5-5`).

## Estructura

| Archivo | Qué hace |
|---|---|
| `index.html`, `estilos.css`, `app.js` | La página de la demo |
| `api/calificar.js` | El endpoint: recibe la consulta, maneja errores, devuelve el resultado |
| `lib/calificador.js` | El agente: instrucciones, esquema de respuesta y llamada a Claude |
| `lib/negocio.js` | Datos del negocio (servicios, precios, criterios). **Lo que se cambia por cliente** |
| `lib/ejemplos.js` | Consultas de ejemplo para probar |
| `scripts/servidor-local.js` | Servidor para probar en tu compu |
| `scripts/probar-calificador.js` | Prueba el agente desde la terminal con los ejemplos |
| `test/` | Pruebas automáticas (no usan la API ni gastan) |

## Probar en tu compu

Necesitás [Node.js](https://nodejs.org) 20 o más nuevo y una clave de la API de Claude (se crea en [platform.claude.com](https://platform.claude.com), sección API Keys).

```bash
npm install
```

```bash
npm test
```

```bash
ANTHROPIC_API_KEY=tu-clave npm run dev
```

Después abrí http://localhost:3000. En Windows (PowerShell) la clave se pasa así: `$env:ANTHROPIC_API_KEY="tu-clave"; npm run dev`.

Para probar los ejemplos desde la terminal, sin la página:

```bash
ANTHROPIC_API_KEY=tu-clave npm run probar
```

## Publicarlo en Vercel

1. En [vercel.com](https://vercel.com): **Add New → Project** e importar este repositorio. No hace falta cambiar ninguna opción.
2. En **Settings → Environment Variables**, agregar `ANTHROPIC_API_KEY` con tu clave.
3. **Deploy**. La demo queda en una URL pública.

Ojo: la demo pública la puede usar cualquiera con el link, y cada consulta se cobra en tu cuenta de la API. Antes de compartirla mucho conviene poner un límite de gasto en la consola de Claude.

## Costo

Cada consulta es una llamada a la API de Claude y se cobra por tokens (texto de entrada y de salida). Con Claude Haiku 5.5 y consultas cortas como las de ejemplo, la estimación es de alrededor de 0,1 centavos de dólar por consulta: con 5 dólares de crédito alcanza para miles de pruebas.

## Próximos pasos

1. Guardar cada lead calificado en Supabase y mostrar una lista ordenada por temperatura.
2. Agente #8: chat de atención que califica cada conversación con este mismo calificador.
3. Agente #10: lector de documentos.
