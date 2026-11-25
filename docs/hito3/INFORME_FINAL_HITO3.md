# FrescApp - Informe técnico final del Hito 3

**Asignatura:** INGT1003 · Arquitectura de Desarrollo (Móvil y Web)
**Proyecto:** FrescApp
**Versión:** 1.0 · **Estado:** revisión final y demostración manual pendientes

> Este informe describe el código y los documentos incluidos en esta entrega. No presenta como realizadas la prueba en un equipo limpio, el despliegue productivo ni la grabación del video cuando aún no hay evidencia de esas actividades.

## 1. Resumen

FrescApp ayuda a organizar alimentos del hogar, sus vencimientos y una lista de compras. El Hito 3 integra la interfaz móvil/web con el servicio propio del Hito 2 mediante un flujo completo de lista de compras. El cliente envía solicitudes REST autenticadas; Cloud Functions verifica el token, valida cada operación y persiste en Cloud Firestore. La aplicación distingue carga, lista vacía y error, y vuelve a consultar los datos después de cada cambio.

La demostración reproducible documentada usa Firebase Emulator Suite y registros sintéticos. No se comprobó un despliegue funcional de la función REST en producción; por ello el informe no ofrece una URL productiva como evidencia. El ensayo en un segundo equipo y el video siguen pendientes.

## 2. Alcance y relación con los hitos anteriores

El Hito 1 definió el problema, usuarios y alcance de FrescApp como aplicación móvil/web para administrar alimentos del hogar. El Hito 2 añadió el servicio REST propio, Firestore, validadores y capas de servidor. En aquel estado, las pantallas de lista todavía leían y escribían directamente en Firestore.

En el Hito 3 se conectó la lista de compras de ambas interfaces al servicio REST existente. Inventario y las otras funciones de la aplicación conservan sus flujos previos. La decisión reduce el alcance del cambio y entrega un flujo completo de punta a punta, aunque no migra de una sola vez todas las pantallas.

## 3. Flujo principal integrado

| Etapa | Responsabilidad |
| --- | --- |
| Interfaz Expo web/móvil | Captura nombre, cantidad y unidad; presenta espera, lista vacía, error y resultado. |
| `services/compras.ts` | Coordina el estado de la lista, sus operaciones y el ciclo de sesión en la interfaz. |
| `services/comprasApi.ts` | Obtiene un ID token actual y llama `GET`, `POST`, `PATCH` o `DELETE` al backend. |
| Controlador REST | Verifica token, cuenta y formato; convierte errores a JSON con códigos HTTP. |
| Servicio y validadores | Aplica reglas del recurso de lista de compras. |
| Repositorio | Aísla las lecturas y escrituras de Firestore. |
| Firestore | Persiste los documentos por usuario en `usuarios/{uid}/listaCompras`. |

Al crear una compra, la pantalla envía nombre, cantidad y unidad. La función toma el UID del token validado, asigna el identificador y las marcas de tiempo, y devuelve el recurso creado. Al recargar la pantalla, la interfaz vuelve a consultar Firestore a través de la API. La persistencia está condicionada a que el emulador continúe activo en la demostración local.

## 4. Arquitectura y capas

FrescApp mantiene un monolito modular: un proyecto móvil/web y una función HTTP organizada por módulos; Firestore y Firebase Authentication son servicios gestionados. No se dividió en microservicios. El diagrama actualizado está en [ARQUITECTURA_HITO3.svg](ARQUITECTURA_HITO3.svg).

La interfaz no consulta Firestore para la lista de compras. Las responsabilidades quedan divididas entre presentación, cliente REST, controlador, servicio de dominio, validador y repositorio. La capa de servicio concentra reglas reutilizables; el repositorio concentra la persistencia. Cloud Functions usa Firebase Admin SDK, por lo que la función debe realizar sus propias comprobaciones de identidad y autorización, además de las reglas que gobiernan el acceso desde SDK cliente.

## 5. Tecnologías y razones

| Tecnología | Uso y motivo | Costo o límite aceptado |
| --- | --- | --- |
| Expo, React Native y Expo Router | Mantener una base de pantallas para móvil y web, navegación y acceso a capacidades del dispositivo. | Las funciones nativas requieren builds compatibles y pruebas por plataforma; una versión web no sustituye la validación móvil. |
| TypeScript | Modelar los datos de interfaz y detectar errores de tipos durante desarrollo. | No reemplaza la validación del servidor. |
| Firebase Authentication | Administrar la cuenta y emitir el ID token que identifica la sesión. | La identidad queda ligada al proveedor Firebase. |
| Cloud Functions v2 (Node.js 22) | Ejecutar la API HTTP propia bajo demanda en la misma plataforma que Firestore. | Dependencia de Firebase; la publicación productiva requiere configuración y facturación adecuadas. |
| API REST propia | Mantener un contrato explícito entre interfaz y servidor con HTTP, JSON y códigos de estado. No se consumen APIs de terceros para esta operación. | No ofrece actualizaciones en tiempo real: el cliente vuelve a consultar después de sus cambios y puede reintentar manualmente. |
| Cloud Firestore | Guardar los documentos y las marcas de tiempo por usuario. | El modelo NoSQL y las reglas requieren mantener validadores y estructura consistentes. |
| Firebase Emulator Suite | Probar Auth, Functions y Firestore sin escrituras de demostración en producción. | Los datos locales dependen de que el emulador permanezca ejecutándose; no es una publicación accesible al docente. |

La solicitud web se limita a los orígenes locales de desarrollo y a los dominios Firebase Hosting de FrescApp. CORS permite que el navegador lea la respuesta, pero no reemplaza el token ni la autorización del backend.

## 6. Contrato REST usado por la interfaz

Base local de ejemplo: `http://127.0.0.1:5001/demo-frescapp-hito3/southamerica-west1/api`. Todas las rutas requieren `Authorization: Bearer <Firebase ID token>`. Los cuerpos de escritura usan `Content-Type: application/json`.

| Método y ruta | Uso | Respuesta de éxito | Errores representativos |
| --- | --- | --- | --- |
| `GET /api/v1/lista-compras` (`limit`, `cursor`) | Consultar registros paginados | `200`, arreglo `data` y `pagination` | `400` límite/cursor inválido; `401` token inválido; `403` cuenta no disponible; `500` error interno |
| `GET /api/v1/lista-compras/{id}` | Consultar un registro | `200`, `{ "data": {…} }` | `400`, `401`, `403`, `404`, `500` |
| `POST /api/v1/lista-compras` | Crear | `201`, recurso y cabecera `Location` | `400` cuerpo o validación; `401`; `403`; `415`; `500` |
| `PATCH /api/v1/lista-compras/{id}` | Cambiar campos permitidos; la app cambia `comprado` | `200`, recurso actualizado | `400`; `401`; `403`; `404`; `415`; `500` |
| `DELETE /api/v1/lista-compras/{id}` | Eliminar | `204`, sin cuerpo | `401`; `403`; `404`; `500` |

Ejemplo de creación:

```json
{"nombre":"Arroz demostración","cantidad":2,"unidad":"unidad"}
```

La API valida nombre, unidad y cantidad; la unidad `unidad` exige cantidad entera y se aceptan hasta tres decimales para cantidades compatibles. El servidor define `comprado: false` y las marcas de tiempo. Los errores tienen forma `{ "error": { "code": "...", "message": "..." } }` y no exponen detalles internos.

## 7. Modelo de datos y privacidad

La colección usada por el flujo es `usuarios/{uid}/listaCompras/{id}`. Cada documento contiene `nombre`, `cantidad`, `unidad`, `comprado`, `creadoEn` y `actualizadoEn`. El ID no se entrega desde el cliente; Firestore lo asigna. El UID se deriva del token validado, no de un campo del cuerpo.

La aplicación también trata correo, nombre/apodo, identificador de cuenta, inventario, fechas de vencimiento, ubicaciones, historial, catálogo privado y datos de hogar. La cámara se activa para leer códigos de barras; el vencimiento se ingresa manualmente. La versión actual no guarda ni envía fotografías ni ejecuta OCR de fechas. El aviso visible fue ajustado para describir este comportamiento.

Las operaciones REST verifican el ID token y validan datos en el servidor; el acceso por SDK cliente se controla además con reglas de Firestore. La eliminación de cuenta tiene un flujo servidor y una solicitud técnica que se conserva al menos 24 horas después de completarse, según el código y el aviso actual.

**Límite de privacidad identificado:** el aviso sigue marcado como borrador y muestra responsable y contacto como “Por definir” si no se configuran. También señala que faltan bases de licitud, conservación, respaldos, transferencias internacionales y procedimiento de derechos. No se consideran resueltos por este informe ni deben inventarse. Ver [anexo de IA y datos personales](ANEXO_IA_Y_DATOS_PERSONALES.md).

## 8. Instalación, uso y demostración

Los requisitos y los comandos reproducibles están en el [manual de instalación y uso](MANUAL_INSTALACION_USO.md). La demostración se prepara con Node.js 22, Java 21, `npm.cmd ci`, el emulador de Auth/Firestore/Functions y Expo Web. El manual incluye los datos sintéticos para hacer una operación y recargar la aplicación.

La guía permite repetir el procedimiento en otra máquina, pero el equipo aún debe realizar y documentar el ensayo de instalación limpia. Tampoco se afirma que haya una URL productiva lista para acceder sin preparación local.

## 9. Evolución de decisiones y registro

| Hito / decisión | Decisión | Alternativa considerada | Motivo, impacto y límite |
| --- | --- | --- | --- |
| Hito 1 | Firebase como base para identidad y datos del producto. | Separar desde el inicio la persistencia en otro proveedor. | Reutiliza la arquitectura base del proyecto; conserva dependencia del ecosistema Firebase. |
| Hito 2 | Monolito modular con API REST propia, capas y Firestore. | Microservicios separados o lógica directa en la interfaz. | Adecuado al tamaño del equipo y al alcance del semestre; menor complejidad de despliegue, a cambio de menor independencia entre módulos. |
| Hito 2 | Mantener pantallas antiguas en acceso Firestore mientras la API se probaba en Postman. | Migrar toda la interfaz de inmediato. | Permitió aislar y evaluar el backend; quedó pendiente un flujo de producto integrado. |
| Hito 3 | Integrar la lista de compras a la API REST y actualizar después de cada operación. | Seguir consultando Firestore desde la pantalla o implementar sincronización en tiempo real. | La UI ahora recorre las capas del servidor; se acepta refresco bajo demanda en vez de tiempo real para mantener un cambio acotado y demostrable. |
| Hito 3 | Habilitar conexiones opcionales a Auth y Firestore Emulator mediante configuración local. | Apuntar el flujo de ensayo a registros reales. | Aísla datos sintéticos de producción; el ID de proyecto debe coincidir entre cliente y emuladores. |

La decisión actual sigue siendo monolito modular. Se revisaría si el equipo, la carga, la frecuencia de despliegue o la necesidad de escalar dominios independientes aumentan lo suficiente para justificar el costo operativo y la complejidad de microservicios.

## 10. Video promocional y entregables pendientes

La pauta solicita un video de hasta 2 minutos: 20 segundos para el problema, 80 segundos mostrando el producto real funcionando y 20 segundos para la promesa/cierre. El video no se ha grabado ni publicado en esta entrega; se debe agregar su enlace público al README cuando el equipo lo produzca. La grabación debe mostrar la app real y no una maqueta.

También quedan por cerrar la ejecución manual en un equipo limpio, la evidencia de recarga persistente y la confirmación del dominio responsable/contacto y contenidos legales del aviso de privacidad.

## 11. Anexo: uso de IA

Se usó OpenAI ChatGPT/Codex como apoyo para revisar requisitos, organizar el apartado, integrar el cliente de lista de compras a la API, y redactar el informe y el manual. El equipo debe revisar el código y los textos contra la pauta y el repositorio, ejecutar el flujo completo con datos sintéticos, confirmar que los errores y las medidas de seguridad se comportan correctamente, y corregir cualquier diferencia antes de entregar. La asistencia de IA no sustituye esa responsabilidad. El detalle está en [ANEXO_IA_Y_DATOS_PERSONALES.md](ANEXO_IA_Y_DATOS_PERSONALES.md).

## 12. Referencias técnicas

1. Firebase. *Call functions via HTTP requests*. https://firebase.google.com/docs/functions/http-events
2. Firebase. *Verify ID tokens*. https://firebase.google.com/docs/auth/admin/verify-id-tokens
3. Firebase. *Connect your app to the Cloud Functions emulator*. https://firebase.google.com/docs/functions/local-emulator
4. Firebase. *Writing conditions for Cloud Firestore Security Rules*. https://firebase.google.com/docs/firestore/security/rules-conditions
5. Expo. *SDK 54*. https://expo.dev/changelog/sdk-54 (la configuración instalada del proyecto se debe revisar con el lockfile del repositorio; no se afirma que el proyecto use SDK 54).
6. Fielding, R., Nottingham, M. & Reschke, J. *HTTP Semantics (RFC 9110)*. https://www.rfc-editor.org/rfc/rfc9110.html
