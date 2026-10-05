import React from 'react';
import { IonModal, IonContent, IonButton, IonIcon } from '@ionic/react';
import { closeCircle, informationCircle, colorPaletteOutline, leafOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import './QualityGuideModal.css';

export interface QualityGuideModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const colorGuideData = [
  {
    level: 'Bajo',
    desc: 'Sin riesgos. ¡Disfruta el día!',
    dotColor: '#00e676',
    bgLight: 'rgba(0, 230, 118, 0.12)',
    textColor: '#008a44'
  },
  {
    level: 'Moderado',
    desc: 'Sensibles, tengan cuidado.',
    dotColor: '#ffea00',
    bgLight: 'rgba(255, 234, 0, 0.18)',
    textColor: '#a67c00'
  },
  {
    level: 'Alto',
    desc: 'Evita ejercicio intenso.',
    dotColor: '#ff9100',
    bgLight: 'rgba(255, 145, 0, 0.12)',
    textColor: '#d96b00'
  },
  {
    level: 'Muy Alto',
    desc: 'Quédate en interiores.',
    dotColor: '#ff1744',
    bgLight: 'rgba(255, 23, 68, 0.12)',
    textColor: '#d50000'
  },
  {
    level: 'Extremo',
    desc: 'Peligro inminente a la salud.',
    dotColor: '#d500f9',
    bgLight: 'rgba(213, 0, 249, 0.12)',
    textColor: '#aa00ff'
  }
];

const QualityGuideModal: React.FC<QualityGuideModalProps> = ({ isOpen, onDismiss }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss} className="custom-quality-modal">
      <div className="modal-wrapper">
        {/* Encabezado del Modal en azul marino con gradiente e icono blanco */}
        <div className="modal-header-color">
          <IonButton fill="clear" onClick={onDismiss} className="close-modal-btn">
            <IonIcon icon={closeCircle} />
          </IonButton>

          <div className="header-icon-badge">
            <IonIcon icon={informationCircle} className="header-icon" />
          </div>
          <h2 className="modal-header-title">Guía de Calidad</h2>
          <span className="modal-header-subtitle">Índice de Calidad del Aire</span>
        </div>

        <IonContent className="modal-body-bg">
          <div className="modal-body-padding">
            {/* Tarjeta 1: ¿Qué es esto? */}
            <div className="info-card primary-card">
              <div className="card-title">
                <div className="card-title-icon-box">
                  <IonIcon icon={leafOutline} />
                </div>
                <span>¿Qué es esto?</span>
              </div>
              <p className="card-description">
                Este apartado muestra el índice de contaminantes en tiempo real detectado por nuestros sensores en puntos estratégicos.
              </p>
            </div>

            {/* Tarjeta 2: Significado de Colores */}
            <div className="info-card">
              <div className="card-title">
                <div className="card-title-icon-box palette-box">
                  <IonIcon icon={colorPaletteOutline} />
                </div>
                <span>Significado de Colores</span>
              </div>

              <div className="color-guide-list">
                {colorGuideData.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="color-status-row"
                    style={{ backgroundColor: item.bgLight }}
                  >
                    <div className="status-dot-wrapper">
                      <span className="status-dot" style={{ backgroundColor: item.dotColor }}></span>
                    </div>
                    <div className="status-text-content">
                      <span className="status-level-badge" style={{ color: item.textColor }}>
                        {item.level}:
                      </span>
                      <span className="status-desc-text"> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="norma-footer">
              <IonIcon icon={shieldCheckmarkOutline} className="norma-icon" />
              <span>Conforme a la Norma Oficial Mexicana de Salud Ambiental</span>
            </div>
          </div>
        </IonContent>
      </div>
    </IonModal>
  );
};

export default QualityGuideModal;
