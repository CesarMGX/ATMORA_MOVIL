import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAirQualityConfig } from '../../utils/airQualityUtils';
import './DeviceMap.css';

export interface MapMarker {
  id: string;
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
  status?: string;
  airQualityLevel?: string | number;
  dotColor?: string;
  pinBodyColor?: string;
}

export interface DeviceMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers: MapMarker[];
  googleApiKey?: string;
}

// Icono personalizado estilo Mercado Libre con indicador de color NOM dinámico
const createMLPinIcon = (dotColor: string = '#00e676', pinBodyColor: string = '#111111') => {
  const svgString = `
    <div class="ml-pin-wrapper">
      <svg class="ml-pin-svg" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C8.954 0 0 8.954 0 20C0 32.5 17.5 46.2 19.166 47.485C19.658 47.863 20.342 47.863 20.834 47.485C22.5 46.2 40 32.5 40 20C40 8.954 31.046 0 20 0Z" fill="${pinBodyColor}"/>
        <circle cx="20" cy="18" r="7.5" fill="${dotColor}" stroke="#ffffff" stroke-width="2"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'custom-ml-pin',
    html: svgString,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40]
  });
};

const DeviceMap: React.FC<DeviceMapProps> = ({ center, zoom = 15, markers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom);
    }

    const map = mapInstanceRef.current;

    // Limpiar marcadores anteriores
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Agregar pines con color dinámico NOM
    markers.forEach((m) => {
      const airConfig = getAirQualityConfig(m.airQualityLevel || 'bajo');
      const finalDotColor = m.dotColor || airConfig.dotColor;
      const finalPinBodyColor = m.pinBodyColor || '#111111';

      const customIcon = createMLPinIcon(finalDotColor, finalPinBodyColor);
      const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div class="device-popup">
          <div class="device-popup-title">${m.title}</div>
          ${m.subtitle ? `<div class="device-popup-subtitle">${m.subtitle}</div>` : ''}
          <div class="device-popup-badge" style="background: ${airConfig.borderColor}">
            ${airConfig.badge} (${m.status || 'Dispositivo Activo'})
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [center.lat, center.lng, zoom, markers]);

  return (
    <div className="device-map-container">
      <div ref={mapContainerRef} className="device-map" />
    </div>
  );
};

export default DeviceMap;
