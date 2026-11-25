# Manual de instalación y uso - Hito 3

**Proyecto:** FrescApp · **Entorno recomendado para la demostración:** Firebase Emulator Suite + Expo Web · **Datos:** sintéticos, locales al emulador.

## 1. Requisitos

- Windows 10/11 con PowerShell.
- Node.js 22 y Java 21 instalados y disponibles en `PATH`.
- Git para clonar el repositorio.
- Navegador actualizado.
- Acceso a internet durante la primera instalación de dependencias.

Comprobar herramientas:

```powershell
node -v
npm.cmd -v
java -version
```

## 2. Obtener y preparar el proyecto

Clona el repositorio de entregas desde GitHub. Abre PowerShell en la carpeta raíz, donde están `package.json`, `firebase.json` y `functions/`. Instala las dependencias y crea la configuración local de Functions:

```powershell
npm.cmd ci
npm.cmd ci --prefix functions
if (-not (Test-Path 'functions/.env')) { Copy-Item 'functions/.env.example' 'functions/.env' }
if (-not (Test-Path '.env.local')) { Copy-Item '.env.example' '.env.local' }
```

Edita `.env.local` y deja estos valores para la demostración local:

```dotenv
EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true
EXPO_PUBLIC_FIREBASE_PROJECT_ID=demo-frescapp-hito3
EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1
EXPO_PUBLIC_API_BASE_URL=
```

No cambies `.env.example`; contiene valores de referencia. Los archivos `.env.local` y `functions/.env` son locales y no deben subirse al repositorio.

## 3. Iniciar el servicio y los emuladores

En la primera ventana de PowerShell, desde la raíz:

```powershell
npx.cmd firebase emulators:start --only auth,firestore,functions --project demo-frescapp-hito3
```

Espera a que Auth, Firestore y Functions indiquen que están listos. La API local queda bajo:

```text
http://127.0.0.1:5001/demo-frescapp-hito3/southamerica-west1/api
```

La base de datos de esta demostración es el emulador local. No se necesita una cuenta de servicio ni se deben usar datos personales reales.

## 4. Iniciar la aplicación web

En una segunda ventana, también en la raíz:

```powershell
npx.cmd expo start --web
```

Abre la dirección local que indique Expo. Si el navegador ya estaba abierto y no tomó `.env.local`, detén el proceso con `Ctrl+C` y ejecuta el comando de nuevo.

## 5. Probar el flujo principal

1. En la pantalla de inicio de sesión, crea una cuenta con un correo sintético, por ejemplo `demo.hito3@example.test`, y una contraseña de prueba que cumpla las reglas de la app. El emulador no envía un correo real.
2. Abre **Lista de compras**.
3. Añade `Arroz demostración`, cantidad `2`, unidad `unidad`.
4. Confirma que aparezca como pendiente.
5. Márcalo como comprado y confirma el cambio.
6. Recarga la pestaña del navegador. La lista debe volver a consultarse y el registro seguir apareciendo mientras los emuladores continúen ejecutándose.
7. Elimina el registro para dejar limpio el conjunto de datos de demostración.

Cada lectura o cambio de la lista usa la API REST propia. La API obtiene el UID desde el token de Firebase Authentication, valida los campos y guarda los datos en `usuarios/{uid}/listaCompras` en Firestore.

## 6. Errores frecuentes

| Mensaje o síntoma | Causa probable | Solución |
| --- | --- | --- |
| `java` no se reconoce | Java no está instalado o no se agregó a `PATH` | Instala Java 21, cierra PowerShell, abre una ventana nueva y verifica `java -version`. |
| La app muestra que no puede conectar con el servidor | Emuladores detenidos, host/puerto incorrecto o `.env.local` no cargado | Mantén la primera ventana abierta; verifica los valores de emulador; reinicia Expo para volver a leer el archivo. |
| Error 401 o la sesión no carga | Cuenta creada en otro proyecto Firebase o sesión/token antiguo | Confirma que app y emuladores usan `demo-frescapp-hito3`; cierra sesión, vuelve a iniciar o crea una cuenta sintética nueva. |
| `npm ci` indica que `package.json` y el lock no coinciden | El ZIP/copia está incompleto o se cambió el directorio | Ejecuta el comando desde la raíz del repositorio. Comprueba que `package-lock.json` esté presente; no uses `npm ci` dentro de la carpeta equivocada. |
| El navegador bloquea la petición por CORS | Origen web distinto de los permitidos | Usa `localhost` o `127.0.0.1` con el puerto de Expo indicado en `functions/index.js`, o registra explícitamente el origen de demostración en la lista permitida y vuelve a levantar Functions. |

## 7. Cierre

Deja los emuladores ejecutándose durante la prueba. Al detenerlos, los datos de la sesión local no equivalen a una copia de respaldo permanente. Para una evaluación desde otro equipo, repite estos pasos y conserva capturas propias del arranque, el flujo y la recarga. No se incluye aquí un enlace de despliegue porque no se confirmó una publicación funcional del servicio Hito 3.
