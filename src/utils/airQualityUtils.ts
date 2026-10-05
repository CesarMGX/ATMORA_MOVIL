/**
 * Utilidades y configuraciones de Calidad del Aire conforme a la NOM-020/NOM-023 (Salud Ambiental)
 */

export type AirQualityLevel = 'bajo' | 'moderado' | 'alto' | 'muy_alto' | 'extremo';

export interface AirQualityConfig {
  key: AirQualityLevel;
  title: string;
  badge: string;
  recommendation: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  badgeColor: string;
  iconName: string;
  dotColor: string;
}

export const AIR_QUALITY_NOM: Record<AirQualityLevel, AirQualityConfig> = {
  bajo: {
    key: 'bajo',
    title: 'Calidad del Aire: Buena',
    badge: 'Bajo',
    recommendation: 'Sin riesgos a la salud. ¡Disfruta el día y realiza actividades al aire libre!',
    borderColor: '#10b981', // Verde
    bgColor: '#f0fdf4',
    textColor: '#065f46',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeColor: '#047857',
    iconName: 'happyOutline',
    dotColor: '#00e676'
  },
  moderado: {
    key: 'moderado',
    title: 'Calidad del Aire: Moderada',
    badge: 'Moderado',
    recommendation: 'Grupos sensibles (personas con asma, adultos mayores o niños), tengan cuidado y reduzcan esfuerzos prolongados.',
    borderColor: '#eab308', // Amarillo
    bgColor: '#fefce8',
    textColor: '#854d0e',
    badgeBg: 'rgba(234, 179, 8, 0.2)',
    badgeColor: '#a16207',
    iconName: 'warningOutline',
    dotColor: '#ffea00'
  },
  alto: {
    key: 'alto',
    title: 'Calidad del Aire: Mala',
    badge: 'Alto',
    recommendation: 'Evita el ejercicio intenso al aire libre y mantén las ventanas cerradas.',
    borderColor: '#f97316', // Naranja
    bgColor: '#fff7ed',
    textColor: '#9a3412',
    badgeBg: 'rgba(249, 115, 22, 0.18)',
    badgeColor: '#c2410c',
    iconName: 'alertCircleOutline',
    dotColor: '#ff9100'
  },
  muy_alto: {
    key: 'muy_alto',
    title: 'Calidad del Aire: Muy Mala',
    badge: 'Muy Alto',
    recommendation: 'Quédate en interiores, mantén ventanas totalmente cerradas y evita cualquier actividad física en exterior.',
    borderColor: '#ef4444', // Rojo
    bgColor: '#fef2f2',
    textColor: '#991b1b',
    badgeBg: 'rgba(239, 68, 68, 0.18)',
    badgeColor: '#b91c1c',
    iconName: 'closeCircleOutline',
    dotColor: '#ff1744'
  },
  extremo: {
    key: 'extremo',
    title: 'Calidad del Aire: Extremadamente Mala',
    badge: 'Extremo',
    recommendation: '¡Alerta de Salud! Peligro inminente a la salud. Permanece resguardado en interiores y utiliza cubrebocas.',
    borderColor: '#a855f7', // Morado
    bgColor: '#faf5ff',
    textColor: '#6b21a8',
    badgeBg: 'rgba(168, 85, 247, 0.18)',
    badgeColor: '#7e22ce',
    iconName: 'alertOutline',
    dotColor: '#d500f9'
  }
};

/**
 * Normaliza una entrada de nivel o lectura y retorna la configuración NOM correspondiente
 */
export function getAirQualityConfig(levelOrValue?: string | number): AirQualityConfig {
  if (!levelOrValue) return AIR_QUALITY_NOM.bajo;

  if (typeof levelOrValue === 'number') {
    if (levelOrValue <= 50) return AIR_QUALITY_NOM.bajo;
    if (levelOrValue <= 100) return AIR_QUALITY_NOM.moderado;
    if (levelOrValue <= 150) return AIR_QUALITY_NOM.alto;
    if (levelOrValue <= 200) return AIR_QUALITY_NOM.muy_alto;
    return AIR_QUALITY_NOM.extremo;
  }

  const normalized = String(levelOrValue).toLowerCase().trim();

  if (normalized.includes('extrem') || normalized.includes('purple') || normalized.includes('5')) {
    return AIR_QUALITY_NOM.extremo;
  }
  if (normalized.includes('muy') || normalized.includes('red') || normalized.includes('4')) {
    return AIR_QUALITY_NOM.muy_alto;
  }
  if (normalized.includes('alt') || normalized.includes('mala') || normalized.includes('orange') || normalized.includes('3')) {
    return AIR_QUALITY_NOM.alto;
  }
  if (normalized.includes('mod') || normalized.includes('yellow') || normalized.includes('2')) {
    return AIR_QUALITY_NOM.moderado;
  }

  return AIR_QUALITY_NOM.bajo;
}
