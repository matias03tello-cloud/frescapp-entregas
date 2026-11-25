# Anexo - Uso de IA y análisis de datos personales

## A. Uso de herramientas de inteligencia artificial

| Herramienta | Parte en que se utilizó como apoyo | Verificación que debe realizar el equipo |
| --- | --- | --- |
| OpenAI ChatGPT/Codex | Revisión de la pauta; propuesta de estructura del apartado Hito 3; apoyo al cliente REST, la conexión local a emuladores, el manual y el borrador del informe técnico | Contrastar el texto con la pauta y el código publicado; ejecutar el flujo con emuladores; revisar cambios con el equipo; verificar que no se expongan secretos y que los errores sean comprensibles. |

La herramienta se usó como asistencia de redacción y programación. El equipo conserva la responsabilidad por las decisiones, el código y la versión final. La revisión automatizada o estática no sustituye una demostración manual. La prueba final en un equipo limpio y la grabación del video están pendientes.

## B. Datos personales y de uso tratados por la aplicación

| Dato | Propósito observable en la aplicación | Almacenamiento o tratamiento observado |
| --- | --- | --- |
| Correo, nombre o apodo e identificador UID | Crear e identificar una cuenta y asociar sus registros | Firebase Authentication; el UID separa las subcolecciones privadas de Firestore. La contraseña la administra Firebase Authentication y no se escribe como campo de despensa. |
| Lista de compras: nombre, cantidad, unidad, estado y marcas de tiempo | Planificar y consultar compras; marcar como comprado | Firestore, bajo `usuarios/{uid}/listaCompras`, accedido en el flujo Hito 3 por la API REST autenticada. |
| Productos del inventario, categorías, cantidades, vencimientos y ubicación | Mostrar despensa, vencimientos y actividad del usuario | Firestore en colecciones privadas por usuario o por hogar. Las reglas de Firestore limitan el acceso; la API valida el ID token y obtiene el UID desde el token verificado. |
| Historial, catálogo privado y pertenencia a hogares | Mantener movimientos de inventario, preferencias del producto y colaboración | Subcolecciones privadas y documentos de hogar en Firestore; acceso sujeto a autenticación y reglas. |
| Imágenes utilizadas para escanear | Leer códigos o fechas cuando la persona inicia el escaneo | El aviso de la app declara procesamiento de OCR en el dispositivo y eliminación de copias temporales; no declara envío de fotografías al servidor. |
| Solicitud de eliminación | Bloquear el acceso y completar el borrado de la cuenta y datos privados | El backend procesa la solicitud; la marca técnica de eliminación se conserva al menos 24 horas tras completar el borrado, conforme al flujo descrito por la app. |

## C. Medidas implementadas y límites

- El cliente envía un ID token de Firebase al backend; la función lo verifica y usa el UID verificado para limitar las operaciones al espacio privado correspondiente.
- La API valida los datos en el servidor; las reglas de Firestore también validan operaciones realizadas por el SDK cliente. Son controles distintos porque el SDK Admin del servidor no queda restringido por las reglas del cliente.
- La configuración local usa Firebase Emulator Suite y datos sintéticos. Las claves de cuenta de servicio no se incluyen en el repositorio.
- El endpoint HTTP limita CORS a los orígenes de desarrollo local y los dominios Firebase Hosting del producto. CORS no sustituye la autenticación.
- La clave pública de configuración cliente Firebase no es una contraseña; los permisos descansan en autenticación, validaciones, controles del servidor y reglas.
- El aviso visible de privacidad todavía es un borrador: responsable y correo de contacto pueden aparecer como “Por definir”. El propio texto indica que faltan completar bases de licitud, conservación, respaldos, transferencias internacionales y procedimiento de derechos. Estos datos deben resolverse con el equipo y la institución antes de un lanzamiento público; no se inventan en este anexo.
- El borrado automático en respaldos y los plazos de conservación no se consideran confirmados por este informe. El comportamiento documentado se limita a lo observable en el código actual.

## Fuentes de verificación del anexo

- Código de autenticación: [`services/auth.ts`](../../services/auth.ts), [`functions/api/controller.js`](../../functions/api/controller.js).
- Modelo y permisos: [`firestore.rules`](../../firestore.rules), [`functions/api/repository.js`](../../functions/api/repository.js).
- Aviso mostrado por la aplicación: [`constants/privacidad.ts`](../../constants/privacidad.ts), [`app/aviso-privacidad.tsx`](../../app/aviso-privacidad.tsx).
- Lectura en dispositivo: [`services/ocrLocal.ts`](../../services/ocrLocal.ts), [`services/archivosPrivados.ts`](../../services/archivosPrivados.ts).
