import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { auth } from './auth';
import { borrarCompra, cambiarEstadoCompra, crearCompra, listarCompras } from './comprasApi';
import { validarCompra, type UnidadCompra } from './comprasModelo';

export interface Compra { id: string; nombre: string; cantidad: number; unidad: UnidadCompra; comprado: boolean }
type EstadoLista = { uid?: string; items: Compra[]; cargando: boolean; cache: boolean; error: string };
const estadoVacio: EstadoLista = { items: [], cargando: false, cache: false, error: '' };

export function useCompras() {
  const [uid, setUid] = useState(() => auth.currentUser?.uid);
  const [revision, setRevision] = useState(0);
  const [estado, setEstado] = useState<EstadoLista>({ ...estadoVacio, uid, cargando: Boolean(uid) });
  const ocupadoRef = useRef(false);
  const [ocupado, setOcupado] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  useEffect(() => onAuthStateChanged(auth, usuario => {
    const siguienteUid = usuario?.uid;
    setUid(siguienteUid);
    setErrorAccion('');
    setEstado(siguienteUid
      ? { uid: siguienteUid, items: [], cargando: true, cache: false, error: '' }
      : estadoVacio);
  }), []);

  useEffect(() => {
    if (!uid) return;
    let activo = true;
    setEstado(actual => ({ uid, items: actual.uid === uid ? actual.items : [], cargando: true, cache: false, error: '' }));
    void listarCompras().then(items => {
      if (activo && auth.currentUser?.uid === uid) setEstado({ uid, items, cargando: false, cache: false, error: '' });
    }).catch(error => {
      if (activo && auth.currentUser?.uid === uid) setEstado({
        uid, items: [], cargando: false, cache: false,
        error: error instanceof Error ? error.message : 'No pudimos consultar tu lista. Intenta nuevamente.',
      });
    });
    return () => { activo = false; };
  }, [uid, revision]);

  async function ejecutar(accion: () => Promise<unknown>) {
    if (ocupadoRef.current) return false;
    const actual = auth.currentUser?.uid;
    if (!actual || actual !== uid || estado.uid !== uid || estado.cargando || estado.error) {
      setErrorAccion('Espera a que el servidor confirme tu lista antes de modificarla.');
      return false;
    }
    ocupadoRef.current = true;
    setOcupado(true);
    setErrorAccion('');
    try {
      await accion();
      if (auth.currentUser?.uid !== actual) return false;
      setRevision(valor => valor + 1);
      return true;
    } catch (error) {
      if (auth.currentUser?.uid === actual) setErrorAccion(
        error instanceof Error ? error.message : 'No pudimos guardar el cambio. Revisa la conexión.',
      );
      return false;
    } finally {
      ocupadoRef.current = false;
      setOcupado(false);
    }
  }

  return {
    ...estado,
    items: estado.uid === uid ? estado.items : [],
    ocupado,
    errorAccion,
    reintentar: () => {
      setEstado({ uid, items: [], cargando: Boolean(uid), cache: false, error: '' });
      setErrorAccion('');
      setRevision(valor => valor + 1);
    },
    agregar: (nombre: string, cantidad: string, unidad: UnidadCompra) => ejecutar(async () => {
      await crearCompra(validarCompra(nombre, cantidad, unidad));
    }),
    marcar: (item: Compra) => ejecutar(() => cambiarEstadoCompra(item)),
    eliminar: (item: Compra) => ejecutar(() => borrarCompra(item.id)),
  };
}
