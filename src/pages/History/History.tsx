import React from 'react';
import {
    IonContent, IonPage, IonButtons, IonBackButton,
    IonButton, IonIcon
} from '@ionic/react';
import { chevronForwardOutline, helpCircleOutline, arrowBackOutline } from 'ionicons/icons';
import './History.css';

const History: React.FC = () => {
    return (
        <IonPage>
            <IonContent className="history-container" scrollY={true}>
                {/* Encabezado Azul Obscuro */}
                <div className="history-header-bg">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" icon={arrowBackOutline} className="back-btn" text="" />
                    </IonButtons>
                </div>

                {/* Tarjeta Blanca Principal */}
                <div className="history-white-card">
                    <h1 className="history-title">Historial</h1>

                    {/* Lista de Botones de Alerta */}
                    <div className="history-list">
                        <IonButton expand="block" className="alert-btn" mode="ios">
                            Dióxido de carbono
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                        </IonButton>

                        <IonButton expand="block" className="alert-btn" mode="ios">
                            Redirección
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                        </IonButton>

                        <IonButton expand="block" className="alert-btn" mode="ios">
                            Velocidad del viento
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                        </IonButton>

                        <IonButton expand="block" className="alert-btn" mode="ios">
                            Radiación solar
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                        </IonButton>

                        <IonButton expand="block" className="alert-btn" mode="ios">
                            Humedad
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                        </IonButton>

                        <IonButton expand="block" className="alert-btn" mode="ios">
                            Temperatura
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                        </IonButton>

                        <IonButton expand="block" className="alert-btn" mode="ios">
                            Precipitaciones
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                        </IonButton>

                        <IonButton expand="block" className="alert-btn" mode="ios">
                            Monóxido de carbono
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                        </IonButton>

                    </div>

                    {/* Sección inferior de ayuda */}
                    <div className="help-section">
                        <div className="help-text">
                            <p>¿Qué significa</p>
                            <p>cada apartado?</p>
                        </div>
                        <IonIcon icon={helpCircleOutline} className="help-icon" />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default History;