# ia-agentes

- Demo de agentes de IA para negocios: calificador de leads (#9), atención al cliente (#8) y lector de documentos (#10). Ver `README.md`.
- Sitio estático sin build + funciones de Vercel en `api/`. JavaScript con módulos ES, sin TypeScript ni frameworks.
- El dueño del proyecto está aprendiendo a programar: código simple, nombres y comentarios en español, explicar cada cambio.
- Todo lo específico del negocio va en `lib/negocio.js`; los agentes no deben tener datos del negocio escritos en el código.
- La clave `ANTHROPIC_API_KEY` sólo se usa en el servidor. Nunca en archivos del navegador ni en el repo.
- Antes de subir cambios: `npm test` y probar la página con `npm run dev` en modo claro y oscuro.
- Los colores van como variables en `estilos.css`, nunca valores sueltos.
