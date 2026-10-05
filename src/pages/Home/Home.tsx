import React from 'react';
import { IonContent, IonPage, IonButton, IonIcon } from '@ionic/react';
import {
    sparklesOutline, hardwareChipOutline,
    locationOutline, shieldCheckmarkOutline, clipboardOutline,
    arrowForwardOutline, checkmarkCircleOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { showInfoAlert } from '../../utils/sweetAlert';
import './Home.css';

const Home: React.FC = () => {
    const history = useHistory();

    const handleProInfo = () => {
        showInfoAlert(
            "Atmora AI Próximamente",
            "El módulo de Predicciones Climáticas con Inteligencia Artificial estará disponible próximamente bajo suscripción Pro."
        );
    };

    return (
        <IonPage>
            <IonContent className="home-container" scrollY={true}>
                {/* Cabecera superior celeste */}
                <div className="home-header-bg"></div>

                {/* Tarjeta blanca con curva superior */}
                <div className="home-white-card">
                    <div className="home-logo-box">
                        <img src="/assets/logo_transparente.png" alt="Atmora Logo" className="welcome-logo" />
                    </div>

                    <div className="welcome-text">
                        <h1>Bienvenido a Atmora!!</h1>
                        <p className="welcome-sub">Monitoreo Ambiental Inteligente y Calidad del Aire.</p>

                        {/* Tarjeta de Resumen General */}
                        <div className="offer-card-main">
                            <h2 className="offer-title">¿Qué ofrecemos?</h2>
                            <p className="offer-desc">
                                Monitoreo ambiental en tiempo real en diferentes localidades, categorizado por colores oficiales (Norma Oficial Mexicana) para cuidar tu salud y la de tu familia.
                            </p>
                        </div>
                    </div>

                    {/* BANNER PROMOCIONAL: PREDICCIONES CON IA (SERVICIO PRO) */}
                    <div className="ai-promo-card">
                        <div className="ai-badge">
                            <IonIcon icon={sparklesOutline} />
                            <span>Próximamente Pro</span>
                        </div>

                        <div className="ai-header-box">
                            <IonIcon icon={hardwareChipOutline} className="ai-icon-large" />
                            <h2 className="ai-title">Predicciones Climáticas con Inteligencia Artificial</h2>
                        </div>

                        <p className="ai-desc">
                            Anticípate al clima y la contaminación. Nuestro algoritmo de IA analiza tendencias de sensores IoT para proyectar el riesgo ambiental hasta con 48 horas de anticipación.
                        </p>

                        <div className="ai-features-list">
                            <div className="ai-feature-item">
                                <IonIcon icon={checkmarkCircleOutline} className="ai-feature-icon" />
                                <span>Pronóstico inteligente de contaminantes a 48 hrs.</span>
                            </div>
                            <div className="ai-feature-item">
                                <IonIcon icon={checkmarkCircleOutline} className="ai-feature-icon" />
                                <span>Alertas preventivas personalizadas.</span>
                            </div>
                            <div className="ai-feature-item">
                                <IonIcon icon={checkmarkCircleOutline} className="ai-feature-icon" />
                                <span>Analítica avanzada de tendencias climáticas.</span>
                            </div>
                        </div>

                        <IonButton 
                            expand="block" 
                            className="ai-cta-btn" 
                            mode="ios"
                            onClick={handleProInfo}
                        >
                            <span>Conoce Atmora AI</span>
                            <IonIcon slot="end" icon={arrowForwardOutline} />
                        </IonButton>
                    </div>

                    {/* SECCIÓN DE SERVICIOS Y CARACTERÍSTICAS */}
                    <h2 className="section-heading">Características de la plataforma</h2>

                    <div className="services-grid">
                        <div className="service-card" onClick={() => history.push('/locations')}>
                            <div className="service-icon-box orange">
                                <IonIcon icon={locationOutline} />
                            </div>
                            <div className="service-content">
                                <h3>Ubicaciones en Tiempo Real</h3>
                                <p>Mapas interactivos con marcadores dinámicos e información de sensores IoT por zona.</p>
                            </div>
                        </div>

                        <div className="service-card">
                            <div className="service-icon-box blue">
                                <IonIcon icon={shieldCheckmarkOutline} />
                            </div>
                            <div className="service-content">
                                <h3>Normativa Oficial NOM</h3>
                                <p>Simbología estandarizada de colores para identificar el nivel de riesgo de salud de manera intuitiva.</p>
                            </div>
                        </div>

                        <div className="service-card" onClick={() => history.push('/history')}>
                            <div className="service-icon-box green">
                                <IonIcon icon={clipboardOutline} />
                            </div>
                            <div className="service-content">
                                <h3>Historial y Analítica</h3>
                                <p>Consulta registros de CO₂, temperatura, humedad y radiación solar acumulados.</p>
                            </div>
                        </div>
                    </div>

                    {/* BOTONES DE ACCIÓN RÁPIDA */}
                    <div className="quick-actions-box">
                        <IonButton 
                            expand="block" 
                            className="action-primary-btn" 
                            mode="ios"
                            onClick={() => history.push('/locations')}
                        >
                            Ver ubicaciones
                        </IonButton>

                        <IonButton 
                            expand="block" 
                            fill="outline" 
                            className="action-secondary-btn" 
                            mode="ios"
                            onClick={() => history.push('/history')}
                        >
                            Predicciones IA
                        </IonButton>
                    </div>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;