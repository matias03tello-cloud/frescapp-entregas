# FrescApp — Proyecto semestral

Repositorio único de entrega: contiene el código fuente de FrescApp y los materiales organizados por hito. Los repositorios anteriores se mantienen separados e intactos.

## Acceso rápido

| Hito | Material | Acceso |
| --- | --- | --- |
| Hito 1 | Documento de propuesta | [Abrir PDF](docs/FrescAPP.pdf) |
| Hito 1 | Presentación | [Abrir presentación](https://matias03tello-cloud.github.io/frescapp-entregas/hito1/presentacion/) |
| Hito 2 | Documento técnico del backend | [Abrir PDF](docs/hito2/FrescApp-Backend-Hito2.pdf) |
| Hito 2 | Presentación | [Abrir presentación](https://matias03tello-cloud.github.io/frescapp-entregas/hito2/presentacion/) |
| Hito 2 | Colección Postman | [Abrir colección](docs/hito2/FrescApp-Hito2.postman_collection.json) |

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

## Hito 3

La estructura del repositorio permite agregar sus materiales en `docs/hito3/` cuando se publique la pauta oficial. No se incluyen entregables de ese hito antes de conocer sus requisitos.
