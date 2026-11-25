import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accionPermisoCamara, motivoCamaraWeb, crearControlCamara } from '../security/camara.ts';

test('permiso inicial, denegado recuperable, denegado permanente y concedido', () => {
  assert.equal(accionPermisoCamara(null), 'consultando');
  assert.equal(accionPermisoCamara({ granted: false, canAskAgain: true }), 'solicitar');
  assert.equal(accionPermisoCamara({ granted: false, canAskAgain: false }), 'ajustes');
  assert.equal(accionPermisoCamara({ granted: true, canAskAgain: false }), 'concedido');
});
test('web sin detector integrado ofrece ingreso manual en lugar de usar la descarga externa', () => {
  const c = { contextoSeguro: true, capturaDisponible: true, lectorIntegrado: true };
  assert.equal(motivoCamaraWeb(c), null);
  for (const k of Object.keys(c)) assert.equal(typeof motivoCamaraWeb({ ...c, [k]: false }), 'string');
});
test('captura espera onCameraReady y un callback viejo no habilita una sesión nueva', () => {
  const cam = crearControlCamara();
  assert.throws(() => cam.iniciar());
  const id = cam.abrir(); assert.throws(() => cam.iniciar());
  cam.lista(id); assert.equal(cam.iniciar(), id);
  cam.cerrar(); assert.equal(cam.vigente(id), false);
  const siguiente = cam.abrir(); cam.lista(id); assert.throws(() => cam.iniciar());
  cam.lista(siguiente); assert.equal(cam.iniciar(), siguiente);
});
test('salir de pantalla o ir a segundo plano invalida el trabajo y actualiza la vista', () => {
  const cam = crearControlCamara(); const estados = [];
  const salir = cam.suscribir(() => estados.push(cam.estado()));
  const id = cam.abrir(); cam.lista(id); cam.cerrar();
  assert.equal(cam.vigente(id), false); assert.deepEqual(cam.estado(), { id: null, lista: false });
  assert.equal(estados.length, 3); salir(); cam.abrir(); assert.equal(estados.length, 3);
});
