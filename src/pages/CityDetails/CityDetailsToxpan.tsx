import React, { useState } from 'react';
import { IonContent, IonPage, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/react';
import {
    arrowBackOutline, wifiOutline, pulseOutline,
    hardwareChipOutline, timeOutline, happyOutline,
    warningOutline, alertCircleOutline, closeCircleOutline, alertOutline
} from 'ionicons/icons';
import DeviceMap, { MapMarker } from '../../components/DeviceMap/DeviceMap';
import QualityGuideModal from '../../components/QualityGuideModal/QualityGuideModal';
import { getAirQualityConfig } from '../../utils/airQualityUtils';
import './CityDetails.css';

const iconMap: Record<string, string> = {
    happyOutline,
    warningOutline,
    alertCircleOutline,
    closeCircleOutline,
    alertOutline
};

const CityDetailsToxpan: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    // Preparado para recibir lecturas de Arduino cuando esté en producción
    const airQualityLevel = 'bajo';
    const airConfig = getAirQualityConfig(airQualityLevel);
    const recommendationIcon = iconMap[airConfig.iconName] || happyOutline;

    const toxpanCenter = { lat: 18.9056, lng: -96.9248 };
    const toxpanMarkers: MapMarker[] = [
        {
            id: 'sensor-toxpan',
            title: 'Ex-hacienda Toxpan',
            subtitle: 'Córdoba, Ver.',
            lat: 18.9056,
            lng: -96.9248,
            status: 'Estación Arduino #2 - Activa',
            airQualityLevel: airQualityLevel
        }
    ];

    return (
        <IonPage>
            <IonContent className="city-container">
                <div className="city-header-bg">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/locations" icon={arrowBackOutline} className="back-btn" text="" />
                    </IonButtons>
                </div>
                <div className="city-white-card">
                    <h1 className="city-title">Ex-hacienda Toxpan</h1>
                    <p className="city-subtitle-desc">Córdoba, Ver.</p>
                    
                    {/* Mapa interactivo con Pin negro estilo Mercado Libre */}
                    <DeviceMap center={toxpanCenter} zoom={16} markers={toxpanMarkers} />

                    <IonButton className="details-btn" mode="ios" onClick={() => setShowModal(true)}>
                        Ver más información
                    </IonButton>

                    {/* INFORMACIÓN ADICIONAL DE LA ESTACIÓN */}
                    <div className="location-extra-info">
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

                        {/* Tarjeta de Recomendación Ambiental Dinámica según NOM 023 */}
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

export default CityDetailsToxpan;