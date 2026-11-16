# SPEC: Integración de Analítica PostHog (EU)

## 1. Contexto y Objetivo
Integrar PostHog Cloud (Región Europa / EU) en la plataforma web de 11.04 Digital (`1104digital.com`) para medición de tráfico, análisis de embudo de conversión (Showcase, Planes, CTA de Reserva) y grabaciones de sesión (Session Replay).

## 2. Configuración y Credenciales
- **Project API Key:** `phc_qCjWqB9AseRqQEJYvhauDoUQ6e9DnHDhcWdqvD533YtA`
- **Host / Ingest Endpoint:** `https://eu.i.posthog.com`
- **Asset Host:** `https://eu-assets.i.posthog.com`
- **Person Profiles:** `identified_only` (mejores prácticas de rendimiento y cuota de eventos).

## 3. Plan Quirúrgico de Implementación (EGM)
1. **Inyección en `index.html`:**
   - Ubicación: `<head>` inmediatamente antes de `</head>`, con carga asíncrona no bloqueante.
   - Definición de stub global `window.posthog` para prevenir caídas si scripts de terceros o eventos disparan antes del onload.
2. **Instrumentación de Eventos en `script.js` (Opcional / Gradual):**
   - Click en botones de CTA "SOLICITAR EPK".
   - Cambio de artista en el Mockup interactivo (Jansound, Alejo V, Dante Toto).
   - Cambio de idioma (ES / EN).
3. **Validación:**
   - Verificación de sintaxis y ausencia de errores en consola.
   - Test de carga asíncrona y no interferencia con WebGL / animaciones.
