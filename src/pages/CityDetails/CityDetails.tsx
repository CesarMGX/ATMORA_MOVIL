import React, { useState } from 'react';
import {
    IonContent, IonPage, IonButtons, IonBackButton, IonButton, IonIcon
} from '@ionic/react';
import {
    arrowBackOutline, wifiOutline, pulseOutline,
    hardwareChipOutline, timeOutline, happyOutline,
    warningOutline, alertCircleOutline, closeCircleOutline, alertOutline
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import DeviceMap, { MapMarker } from '../../components/DeviceMap/DeviceMap';
import QualityGuideModal from '../../components/QualityGuideModal/QualityGuideModal';
import { Ubicacion } from '../../services/locationService';
import { getAirQualityConfig } from '../../utils/airQualityUtils';
import './CityDetails.css';

// Mapeo de iconos dinámicos para Ionic
const iconMap: Record<string, string> = {
    happyOutline,
    warningOutline,
    alertCircleOutline,
    closeCircleOutline,
    alertOutline
};

const CityDetails: React.FC = () => {
    const reactLocation = useLocation<{ locationData?: Ubicacion }>();
    const [showModal, setShowModal] = useState(false);

    const locationData = reactLocation.state?.locationData;

    const lat = locationData ? Number(locationData.latitud) : 18.8943;
    const lng = locationData ? Number(locationData.longitud) : -96.9353;
    const zoneTitle = locationData?.nombre_ubicacion || 'Córdoba, Ver.';
    const siteDescription = locationData?.descripcion || 'Parque 21 de mayo';

    // Nivel de calidad de aire enviado por la API/Arduino (default 'bajo')
    const airQualityLevel = (locationData as any)?.calidad_aire || (locationData as any)?.nivel_calidad || 'bajo';
    const airConfig = getAirQualityConfig(airQualityLevel);
    const recommendationIcon = iconMap[airConfig.iconName] || happyOutline;

    const mapCenter = { lat, lng };
    const mapMarkers: MapMarker[] = [
        {
            id: `sensor-${locationData?.id_ubicacion || 1}`,
            title: siteDescription,
            subtitle: zoneTitle,
            lat: lat,
            lng: lng,
            status: 'Estación de Monitoreo Activa',
            airQualityLevel: airQualityLevel
        }
    ];

    return (
        <IonPage>
            <IonContent className="city-container" scrollY={true}>
                <div className="city-header-bg">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/locations" icon={arrowBackOutline} className="back-btn" text="" />
                    </IonButtons>
                </div>

                <div className="city-white-card">
                    <h1 className="city-title">{zoneTitle}</h1>
                    <p className="city-subtitle-desc">
                        {siteDescription}
                    </p>
                    
                    {/* Mapa interactivo con Pin negro estilo Mercado Libre */}
                    <DeviceMap center={mapCenter} zoom={16} markers={mapMarkers} />

                    {/* Botón Naranja separado con margen */}
                    <IonButton className="details-btn" mode="ios" onClick={() => setShowModal(true)}>
                        Ver más información
                    </IonButton>

                    {/* INFORMACIÓN ADICIONAL PARA ENRIQUECER LA PANTALLA */}
                    <div className="location-extra-info">
                        {/* Tarjeta 1: Estado del Sensor y Parámetros */}
                        <div className="extra-info-card">
                            <div className="extra-card-header">
                                <div className="status-indicator-dot online"></div>
                                <span className="extra-card-title">Estación de Monitoreo</span>
                                <span className="status-badge-online">En línea</span>
                            </div>

                            <div className="sensor-stats-grid">
                                <div className="stat-chip">
                                    <IonIcon icon={wifiOutline} className="chip-icon" />
                                    <div className="chip-text">
                                        <span className="chip-label">Conexión</span>
                                        <span className="chip-val">Red IoT</span>
                                    </div>
                                </div>

                                <div className="stat-chip">
                                    <IonIcon icon={pulseOutline} className="chip-icon" />
                                    <div className="chip-text">
                                        <span className="chip-label">Frecuencia</span>
                                        <span className="chip-val">5 min</span>
                                    </div>
                                </div>

                                <div className="stat-chip">
                                    <IonIcon icon={hardwareChipOutline} className="chip-icon" />
                                    <div className="chip-text">
                                        <span className="chip-label">Sensores</span>
                                        <span className="chip-val">Multiparám.</span>
                                    </div>
                                </div>

                                <div className="stat-chip">
                                    <IonIcon icon={timeOutline} className="chip-icon" />
                                    <div className="chip-text">
                                        <span className="chip-label">Sincronizado</span>
                                        <span className="chip-val">Tiempo real</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta 2: Recomendación Ambiental Dinámica según NOM 023 */}
                        <div 
                            className="extra-info-card recommendation-card"
                            style={{
                                borderLeftColor: airConfig.borderColor,
                                backgroundColor: airConfig.bgColor
                            }}
                        >
                            <div className="recommendation-header">
                                <IonIcon 
                                    icon={recommendationIcon} 
                                    className="recommendation-icon" 
                                    style={{ color: airConfig.borderColor }}
                                />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span className="recommendation-title" style={{ color: airConfig.textColor }}>
                                            {airConfig.title}
                                        </span>
                                        <span 
                                            style={{
                                                backgroundColor: airConfig.badgeBg,
                                                color: airConfig.badgeColor,
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                padding: '2px 8px',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            {airConfig.badge}
                                        </span>
                                    </div>
                                    <p className="recommendation-text" style={{ color: airConfig.textColor }}>
                                        {airConfig.recommendation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL REDISEÑADO DE GUÍA DE CALIDAD */}
                <QualityGuideModal isOpen={showModal} onDismiss={() => setShowModal(false)} />
            </IonContent>
        </IonPage>
    );
};

export default CityDetails;