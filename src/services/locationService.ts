export interface Ubicacion {
  id?: number;
  id_ubicacion?: number;
  nombre?: string;
  nombre_ubicacion: string;
  descripcion: string;
  estado?: string;
  latitud: string | number;
  longitud: string | number;
}

const API_BASE_URL = 'https://atmoraweb-production.up.railway.app/api';

/**
 * Servicio para obtener y gestionar las Ubicaciones de Monitoreo
 */
export const locationService = {
  /**
   * Obtiene la lista completa de ubicaciones desde la API
   */
  async getUbicaciones(): Promise<Ubicacion[]> {
    const response = await fetch(`${API_BASE_URL}/ubicaciones`);
    if (!response.ok) {
      throw new Error('Error al obtener las ubicaciones del servidor.');
    }

    const json = await response.json();

    // Manejar estructura { status: "success", data: [...] } o array directo [...]
    const dataList: any[] = Array.isArray(json) ? json : (json.data || []);
    
    return dataList.map(u => ({
      id_ubicacion: u.id_ubicacion || u.id || 1,
      nombre_ubicacion: u.nombre_ubicacion || u.nombre || 'Ubicación sin nombre',
      descripcion: u.descripcion || u.nombre_ubicacion || 'Zona de monitoreo ambiental',
      estado: u.estado || 'activo',
      latitud: parseFloat(u.latitud) || 18.8943,
      longitud: parseFloat(u.longitud) || -96.9353
    }));
  },

  /**
   * Obtiene el detalle de una ubicación específica por su ID
   */
  async getUbicacionById(id: number): Promise<Ubicacion> {
    const response = await fetch(`${API_BASE_URL}/ubicaciones/${id}`);
    if (!response.ok) {
      throw new Error('No se pudo encontrar la ubicación especificada.');
    }

    const json = await response.json();
    const u = json.data || json;

    return {
      id_ubicacion: u.id_ubicacion || u.id || id,
      nombre_ubicacion: u.nombre_ubicacion || u.nombre || 'Ubicación',
      descripcion: u.descripcion || 'Zona de monitoreo ambiental',
      estado: u.estado || 'activo',
      latitud: parseFloat(u.latitud) || 18.8943,
      longitud: parseFloat(u.longitud) || -96.9353
    };
  }
};
