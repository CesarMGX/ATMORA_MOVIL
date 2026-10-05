import React, { useState } from 'react';
import {
    IonContent, IonPage, IonButtons, IonBackButton, IonButton, IonIcon,
    IonModal, IonAccordionGroup, IonAccordion, IonItem, IonLabel
} from '@ionic/react';
import {
    waterOutline, sunnyOutline, navigateOutline,
    speedometerOutline, thermometerOutline, cloudOfflineOutline,
    arrowBackOutline, sparklesOutline, helpCircleOutline, closeOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Predictions.css';

export interface VariableItem {
    id: string;
    name: string;
    unit: string;
    icon: string;
}

export const PREDICTION_VARIABLES: VariableItem[] = [
    { id: 'humedad', name: 'Humedad', unit: '%', icon: waterOutline },
    { id: 'radiacion', name: 'Radiación Solar', unit: 'W/m²', icon: sunnyOutline },
    { id: 'viento', name: 'Velocidad del Viento', unit: 'km/h', icon: navigateOutline },
    { id: 'presion', name: 'Presión Atmosférica', unit: 'hPa', icon: speedometerOutline },
    { id: 'temperatura', name: 'Temperatura', unit: '°C', icon: thermometerOutline },
    { id: 'contaminacion', name: 'Contaminación', unit: 'ppm', icon: cloudOfflineOutline }
];

const PredictionSelection: React.FC = () => {
    const history = useHistory();
    const [showHelpModal, setShowHelpModal] = useState(false);

    const handleSelectVariable = (variable: VariableItem) => {
        history.push({
            pathname: '/prediction-config',
            state: { variable }
        });
    };

    return (
        <IonPage>
            <IonContent className="prediction-container" scrollY={true}>
                {/* Encabezado azul marino pegajoso */}
                <div className="prediction-header-bg">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" icon={arrowBackOutline} className="back-btn" text="" />
                    </IonButtons>
                </div>

                {/* Cuerpo principal en tarjeta blanca */}
                <div className="prediction-white-card">
                    <h1 className="prediction-main-title">
                        <IonIcon icon={sparklesOutline} style={{ color: '#ff732e', marginRight: '8px' }} />
                        Predicciones con IA
                    </h1>
                    <p className="prediction-subtitle">
                        Paso 1 de 3: Selecciona la variable ambiental a predecir
                    </p>

                    {/* Menú de selección con botones naranjas destacados */}
                    <div className="variable-selection-list">
                        {PREDICTION_VARIABLES.map((item) => (
                            <IonButton
                                key={item.id}
                                expand="block"
                                className="variable-select-btn"
                                mode="ios"
                                onClick={() => handleSelectVariable(item)}
                            >
                                <IonIcon slot="start" icon={item.icon} className="variable-icon" />
                                {item.name}
                            </IonButton>
                        ))}
                    </div>

                    {/* Sección de Ayuda Inferior Derecha con Icono de Pregunta Saltando */}
                    <div className="prediction-help-corner" onClick={() => setShowHelpModal(true)}>
                        <div className="prediction-help-text">
                            <p>¿Qué significa</p>
                            <p>cada apartado?</p>
                        </div>
                        <IonIcon icon={helpCircleOutline} className="prediction-help-bouncing-icon" />
                    </div>
                </div>

                {/* MODAL INTERACTIVO CON SECCIONES DESPLEGABLES */}
                <IonModal isOpen={showHelpModal} onDidDismiss={() => setShowHelpModal(false)} className="custom-modal">
                    <div className="modal-wrapper">
                        <div className="modal-header-color">
                            <IonButton
                                fill="clear"
                                className="close-modal-btn"
                                onClick={() => setShowHelpModal(false)}
                            >
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                            <IonIcon icon={helpCircleOutline} className="header-icon" />
                            <h2>Guía de Predicciones IA</h2>
                            <p style={{ margin: '6px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                                Toca cualquier sección para ver qué significa su predicción
                            </p>
                        </div>

                        <IonContent className="ion-padding" style={{ background: '#f4f7f9' }}>
                            <IonAccordionGroup expand="inset">
                                <IonAccordion value="humedad">
                                    <IonItem slot="header" color="light">
                                        <IonIcon icon={waterOutline} slot="start" style={{ color: '#3b82f6' }} />
                                        <IonLabel style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                            ¿Qué significa la predicción de Humedad?
                                        </IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content" style={{ background: 'white', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        Mide qué tan cargado de agua está el aire. Esta predicción te ayuda a saber si hará un clima bochornoso, si habrá neblina por la mañana o probabilidad de lluvias.
                                    </div>
                                </IonAccordion>

                                <IonAccordion value="radiacion">
                                    <IonItem slot="header" color="light">
                                        <IonIcon icon={sunnyOutline} slot="start" style={{ color: '#eab308' }} />
                                        <IonLabel style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                            ¿Qué significa la predicción de Radiación Solar?
                                        </IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content" style={{ background: 'white', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        Indica la intensidad del sol y los rayos UV. Te permite anticipar qué tan fuerte estará el calor para proteger tu piel, usar bloqueador solar o planear actividades al aire libre.
                                    </div>
                                </IonAccordion>

                                <IonAccordion value="viento">
                                    <IonItem slot="header" color="light">
                                        <IonIcon icon={navigateOutline} slot="start" style={{ color: '#06b6d4' }} />
                                        <IonLabel style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                            ¿Qué significa la predicción de Velocidad del Viento?
                                        </IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content" style={{ background: 'white', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        Calcula qué tan fuerte soplará el viento en las próximas horas. Sirve para saber si habrá ráfagas de aire fresco, si se limpiará la contaminación o si cambiará el clima.
                                    </div>
                                </IonAccordion>

                                <IonAccordion value="presion">
                                    <IonItem slot="header" color="light">
                                        <IonIcon icon={speedometerOutline} slot="start" style={{ color: '#8b5cf6' }} />
                                        <IonLabel style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                            ¿Qué significa la predicción de Presión Atmosférica?
                                        </IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content" style={{ background: 'white', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        Mide el peso del aire en el ambiente. Cuando la presión baja de repente, nuestra Inteligencia Artificial detecta que se acerca mal tiempo, lluvias o frentes fríos.
                                    </div>
                                </IonAccordion>

                                <IonAccordion value="temperatura">
                                    <IonItem slot="header" color="light">
                                        <IonIcon icon={thermometerOutline} slot="start" style={{ color: '#ff732e' }} />
                                        <IonLabel style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                            ¿Qué significa la predicción de Temperatura?
                                        </IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content" style={{ background: 'white', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        Estima cuántos grados centígrados (°C) se sentirán en el ambiente combinando la humedad, el viento y la radiación solar, ayudándote a decidir cómo vestirte y cuidarte del frío o calor.
                                    </div>
                                </IonAccordion>

                                <IonAccordion value="contaminacion">
                                    <IonItem slot="header" color="light">
                                        <IonIcon icon={cloudOfflineOutline} slot="start" style={{ color: '#ef4444' }} />
                                        <IonLabel style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                            ¿Qué significa la predicción de Contaminación?
                                        </IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content" style={{ background: 'white', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        Evalúa la concentración de gases contaminantes como Monóxido de Carbono (CO) y Dióxido de Carbono (CO₂). Te permite conocer la calidad del aire estimada para proteger tu salud respiratoria.
                                    </div>
                                </IonAccordion>
                            </IonAccordionGroup>
                        </IonContent>
                    </div>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default PredictionSelection;
