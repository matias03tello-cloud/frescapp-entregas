# FrescApp — Proyecto semestral

Repositorio único de entrega: contiene el código fuente de FrescApp y los materiales organizados por hito. Los repositorios anteriores se mantienen separados e intactos.

## Link de descarga

[Descargar e instalar FrescApp para Android (APK v5.0.0, build 10)](https://expo.dev/accounts/k1ng03/projects/arq-app-compras/builds/d8896eae-3eda-4013-a2d7-579f303d4006). El enlace abre la ficha pública del build de distribución interna.

## Acceso rápido

| Hito | Material | Acceso |
| --- | --- | --- |
| Hito 1 | Documento de propuesta | [Abrir PDF](docs/FrescAPP.pdf) |
| Hito 1 | Presentación | [Abrir presentación](https://matias03tello-cloud.github.io/frescapp-entregas/hito1/presentacion/) |
| Hito 2 | Documento técnico del backend | [Abrir PDF](docs/hito2/FrescApp-Backend-Hito2.pdf) |
| Hito 2 | Presentación | [Abrir presentación](https://matias03tello-cloud.github.io/frescapp-entregas/hito2/presentacion/) |
| Hito 2 | Colección Postman | [Abrir colección](docs/hito2/FrescApp-Hito2.postman_collection.json) |
| Hito 3 | Documento técnico final | [Abrir PDF](docs/hito3/INFORME_FINAL_HITO3.pdf) |
| Hito 3 | Manual de instalación y uso | [Abrir manual](docs/hito3/MANUAL_INSTALACION_USO.md) |
| Hito 3 | Anexo de IA y datos personales | [Abrir anexo](docs/hito3/ANEXO_IA_Y_DATOS_PERSONALES.md) |
| Hito 3 | Diagrama actualizado | [Abrir diagrama](docs/hito3/ARQUITECTURA_HITO3.svg) |
| Hito 3 | Video promocional (43 segundos) | [Reproducir o descargar](docs/hito3/VIDEO_PROMOCIONAL_HITO3.mp4) |
| Hito 3 | Aplicación Android (APK) | [Descargar e instalar](https://expo.dev/accounts/k1ng03/projects/arq-app-compras/builds/d8896eae-3eda-4013-a2d7-579f303d4006) |

El [índice web del proyecto](https://matias03tello-cloud.github.io/frescapp-entregas/) reúne los accesos para presentar y revisar los materiales.

## Hito 1

- Documento de propuesta: [`docs/FrescAPP.pdf`](docs/FrescAPP.pdf).
- Mapa del producto: [`docs/Mapa_Producto.png`](docs/Mapa_Producto.png).
- Diagrama de arquitectura: [`docs/Diagrama_Arquitectura.png`](docs/Diagrama_Arquitectura.png).
- Presentación web: [`docs/hito1/presentacion/index.html`](docs/hito1/presentacion/index.html).
- Código de la aplicación: carpetas [`app`](app), [`components`](components), [`services`](services) y [`assets`](assets).

## Hito 2 — Backend

- Informe técnico PDF: [`docs/hito2/FrescApp-Backend-Hito2.pdf`](docs/hito2/FrescApp-Backend-Hito2.pdf).
- Documento técnico editable: [`docs/hito2/BACKEND_HITO2.md`](docs/hito2/BACKEND_HITO2.md).
- Contrato y capas REST: [`functions/api/README.md`](functions/api/README.md).
- Modelo Firestore: [`db/MODELO_HITO2.md`](db/MODELO_HITO2.md).
- Script de creación del modelo: [`db/crear-estructura-hito2.cjs`](db/crear-estructura-hito2.cjs).
- Colección de pruebas: [`docs/hito2/FrescApp-Hito2.postman_collection.json`](docs/hito2/FrescApp-Hito2.postman_collection.json).
- Ejemplos de configuración sin secretos: [`.env.example`](.env.example) y [`functions/.env.example`](functions/.env.example).
- Presentación web: [`docs/hito2/presentacion/index.html`](docs/hito2/presentacion/index.html).
- Informes y capturas de las pruebas: [`docs/hito2/evidencias/`](docs/hito2/evidencias/).

La demostración de la API se ejecuta localmente contra Firebase Emulator Suite y utiliza datos sintéticos. La colección no apunta a servicios de producción.

### Preparación local en Windows PowerShell

Requisitos: Node.js 22 y Java 21. Desde la carpeta raíz del proyecto:

```powershell
if (!(Test-Path 'functions/.env')) { Copy-Item 'functions/.env.example' 'functions/.env' }
npm.cmd ci
npm.cmd ci --prefix functions
npx.cmd firebase emulators:start --only auth,firestore,functions --project demo-frescapp-hito2
```

Las credenciales privadas y los archivos `.env` locales no forman parte del repositorio.

## Hito 3 — Integración del producto

- Apartado de entrega: [`docs/hito3/`](docs/hito3/README.md).
- Informe técnico final PDF y fuentes editables: [`docs/hito3/INFORME_FINAL_HITO3.pdf`](docs/hito3/INFORME_FINAL_HITO3.pdf), [`Markdown`](docs/hito3/INFORME_FINAL_HITO3.md) y [`LaTeX`](docs/hito3/INFORME_FINAL_HITO3.tex).
- Manual de instalación y uso: [`docs/hito3/MANUAL_INSTALACION_USO.md`](docs/hito3/MANUAL_INSTALACION_USO.md).
- Diagrama de arquitectura: [`docs/hito3/ARQUITECTURA_HITO3.svg`](docs/hito3/ARQUITECTURA_HITO3.svg).
- **Aplicación Android (APK v5.0.0, build 10):** [descargar e instalar](https://expo.dev/accounts/k1ng03/projects/arq-app-compras/builds/d8896eae-3eda-4013-a2d7-579f303d4006).
- Anexo de IA y análisis de datos personales: [`docs/hito3/ANEXO_IA_Y_DATOS_PERSONALES.md`](docs/hito3/ANEXO_IA_Y_DATOS_PERSONALES.md), también integrado al PDF.
- Flujo integrado: la lista de compras de la app consume la API REST propia; la función persiste en Firestore. La guía local usa Auth, Functions y Firestore Emulator con datos sintéticos.
- **Video promocional (43 segundos):** [reproducir o descargar](docs/hito3/VIDEO_PROMOCIONAL_HITO3.mp4). La revisión final de su contenido frente a la pauta queda a cargo del equipo.
- La prueba en un equipo limpio, la evidencia en vivo y la confirmación de despliegue productivo quedan identificadas como pendientes en los documentos.


