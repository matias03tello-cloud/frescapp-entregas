# Hito 3 - Integración del producto

Esta carpeta reúne los entregables documentales del Hito 3 y sus fuentes editables. El flujo elegido para la integración es la **lista de compras**: la interfaz solicita los datos al servicio propio; la API valida la sesión y la entrada; el servidor persiste en Firestore.

## Entregables

| Entregable solicitado | Archivo o ubicación | Estado |
| --- | --- | --- |
| Producto funcional integrado | Código del proyecto en la raíz; flujo de lista de compras integrado a REST | Código integrado; falta ensayo final en un equipo limpio y evidencia de ejecución en vivo |
| Documento técnico final en PDF | [Informe técnico Hito 3 (PDF)](INFORME_FINAL_HITO3.pdf) | Preparado; incluye arquitectura, evolución, decisiones, límites y anexos |
| Documento técnico editable | [Fuente Markdown](INFORME_FINAL_HITO3.md) y [fuente LaTeX](INFORME_FINAL_HITO3.tex) | Listo para mantener junto al PDF |
| Diagrama actualizado | [Arquitectura Hito 3 (SVG)](ARQUITECTURA_HITO3.svg) | Basado en las capas y rutas del código actual |
| Manual de instalación y uso | [Manual](MANUAL_INSTALACION_USO.md) | Preparado con requisitos, comandos, datos sintéticos y soluciones a errores frecuentes |
| Video promocional de hasta 2 minutos | Enlace a incorporar en el [README principal](../../README.md) | **Pendiente de grabar y publicar por el equipo**; no se inventó un enlace |
| Anexo de IA y análisis de datos personales | [Anexo editable](ANEXO_IA_Y_DATOS_PERSONALES.md), también incorporado al informe PDF | Preparado; destaca los datos y las partes de privacidad que aún deben completar antes de un lanzamiento público |

## Recorrido demostrable

1. Iniciar sesión con una cuenta sintética del emulador.
2. Crear un producto de prueba en la lista.
3. Verificar la respuesta del servicio y que el producto aparezca en pantalla.
4. Marcarlo como comprado y eliminarlo.
5. Recargar la aplicación y volver a consultar la lista mientras el emulador siga activo.

La configuración de la app permite apuntar Auth, Firestore y la API REST a Firebase Emulator Suite. La configuración de producción permanece separada. El informe no afirma que la función REST esté desplegada en producción ni que el ensayo en un segundo equipo ya se haya realizado.

## Accesos

- [Manual paso a paso](MANUAL_INSTALACION_USO.md)
- [Informe PDF](INFORME_FINAL_HITO3.pdf)
- [Informe editable](INFORME_FINAL_HITO3.md)
- [Análisis de IA y datos](ANEXO_IA_Y_DATOS_PERSONALES.md)
- [Diagrama de arquitectura](ARQUITECTURA_HITO3.svg)
- [Contrato REST de lista de compras](../../functions/api/README.md)
