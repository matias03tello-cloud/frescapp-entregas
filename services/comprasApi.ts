import { auth } from './auth';
import type { Compra } from './compras';
import type { UnidadCompra } from './comprasModelo';

type RespuestaApi<T> = { data: T; pagination?: { nextCursor: string | null } };
type ErrorApi = { error?: { code?: string; message?: string } };

const usarEmuladores = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim() || 'super-ahorro-app';
const hostEmulador = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST?.trim() || '127.0.0.1';
const basePorDefecto = usarEmuladores
  ? `http://${hostEmulador}:5001/${projectId}/southamerica-west1/api`
  : 'https://southamerica-west1-super-ahorro-app.cloudfunctions.net/api';
const baseApi = (process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || basePorDefecto).replace(/\/+$/u, '');

async function solicitar<T>(ruta: string, metodo: 'GET' | 'POST' | 'PATCH' | 'DELETE', cuerpo?: unknown): Promise<RespuestaApi<T>> {
  const usuario = auth.currentUser;
  if (!usuario) throw new Error('Inicia sesión para consultar tu lista de compras.');

  const ejecutar = async (forzarToken: boolean) => {
    const token = await usuario.getIdToken(forzarToken);
    return fetch(`${baseApi}${ruta}`, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(cuerpo === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(cuerpo === undefined ? {} : { body: JSON.stringify(cuerpo) }),
    });
  };

  let respuesta: Response;
  try {
    respuesta = await ejecutar(false);
    if (respuesta.status === 401) respuesta = await ejecutar(true);
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa la conexión y que el servicio esté iniciado.');
  }

  if (respuesta.status === 204) return { data: undefined as T };
  const datos = await respuesta.json().catch(() => ({})) as RespuestaApi<T> & ErrorApi;
  if (!respuesta.ok) {
    throw new Error(datos.error?.message || `El servidor respondió con el estado ${respuesta.status}.`);
  }
  return datos;
}

export async function listarCompras(): Promise<Compra[]> {
  const items: Compra[] = [];
  let cursor: string | null = null;
  do {
    const query = new URLSearchParams({ limit: '100', ...(cursor ? { cursor } : {}) });
    const resultado = await solicitar<Compra[]>(
      `/v1/lista-compras?${query.toString()}`, 'GET');
    items.push(...resultado.data);
    cursor = resultado.pagination?.nextCursor ?? null;
  } while (cursor);
  return items.sort((a, b) => Number(a.comprado) - Number(b.comprado) || a.nombre.localeCompare(b.nombre, 'es'));
}

export function crearCompra(datos: { nombre: string; cantidad: number; unidad: UnidadCompra }): Promise<Compra> {
  return (await solicitar<Compra>('/v1/lista-compras', 'POST', datos)).data;
}

export function cambiarEstadoCompra(compra: Compra): Promise<Compra> {
  return (await solicitar<Compra>(`/v1/lista-compras/${encodeURIComponent(compra.id)}`, 'PATCH', { comprado: !compra.comprado })).data;
}

export function borrarCompra(id: string): Promise<void> {
  await solicitar<void>(`/v1/lista-compras/${encodeURIComponent(id)}`, 'DELETE');
}
