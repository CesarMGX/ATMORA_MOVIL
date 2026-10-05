/**
 * Archivo: src/services/predictionService.ts
 * Módulo de servicio de Inteligencia Artificial para Registro INDAUTOR.
 * Consumo de endpoints de predicción por fecha (YYYY-MM-DD) para variables ambientales y gases de contaminación.
 */

export interface DatePredictionPayload {
  fecha: string;
}

export interface PredictionResultData {
  id_prediccion?: number;
  fecha?: string;
  fecha_hora?: string;
  temperatura_predicha?: number;
  humedad_predicha?: number;
  radiacion_predicha?: number;
  viento_predicho?: number;
  presion_predicha?: number;
  co_predicho?: number;
  co2_predicho?: number;
  valor_predicho?: number;
  unidad?: string;
  [key: string]: any;
}

export interface PredictionApiResponse {
  status: string;
  data: PredictionResultData;
  message?: string;
}

const API_BASE_URL = 'https://atmoraweb-production.up.railway.app/api';

/**
 * Función genérica auxiliar para realizar peticiones POST a la API de predicción por fecha
 */
async function postPrediction(endpoint: string, fecha: string): Promise<PredictionResultData> {
  try {
    const response = await fetch(`${API_BASE_URL}/predecir/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fecha })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error ${response.status} (/predecir/${endpoint}): ${errText || response.statusText}`);
    }

    const json = await response.json();
    console.log(`[API /predecir/${endpoint}]:`, json);

    // Extraer flexiblemente los datos sin importar la estructura (json.data, json.result o json directo)
    const resultData = json?.data || json?.result || json;

    if (resultData && typeof resultData === 'object') {
      return resultData;
    }

    throw new Error(json?.message || `No se pudieron obtener datos de predicción para ${endpoint}.`);
  } catch (error: any) {
    console.log(`Petición /predecir/${endpoint} falló o usó respaldo:`, error.message);
    throw error;
  }
}

/**
 * Servicio centralizado para el consumo de todos los endpoints de Predicciones con IA
 */
export const predictionService = {
  /**
   * POST /api/predecir/temperatura
   * Predicción de Temperatura Ambiental por fecha { fecha: "YYYY-MM-DD" }
   */
  predecirTemperatura: (fecha: string) => postPrediction('temperatura', fecha),

  /**
   * POST /api/predecir/humedad
   * Predicción de Humedad por fecha { fecha: "YYYY-MM-DD" }
   */
  predecirHumedad: (fecha: string) => postPrediction('humedad', fecha),

  /**
   * POST /api/predecir/radiacion
   * Predicción de Radiación Solar por fecha { fecha: "YYYY-MM-DD" }
   */
  predecirRadiacion: (fecha: string) => postPrediction('radiacion', fecha),

  /**
   * POST /api/predecir/viento
   * Predicción de Velocidad del Viento por fecha { fecha: "YYYY-MM-DD" }
   */
  predecirViento: (fecha: string) => postPrediction('viento', fecha),

  /**
   * POST /api/predecir/presion
   * Predicción de Presión Atmosférica por fecha { fecha: "YYYY-MM-DD" }
   */
  predecirPresion: (fecha: string) => postPrediction('presion', fecha),

  /**
   * POST /api/predecir/co
   * Predicción de Monóxido de Carbono (CO) por fecha { fecha: "YYYY-MM-DD" }
   */
  predecirCO: (fecha: string) => postPrediction('co', fecha),

  /**
   * POST /api/predecir/co2
   * Predicción de Dióxido de Carbono (CO2) por fecha { fecha: "YYYY-MM-DD" }
   */
  predecirCO2: (fecha: string) => postPrediction('co2', fecha)
};
