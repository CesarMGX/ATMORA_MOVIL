import React, { useState, useEffect } from 'react';
import {
    IonContent, IonPage, IonButtons, IonBackButton, IonButton,
    IonSelect, IonSelectOption, IonDatetime, useIonLoading, IonIcon
} from '@ionic/react';
import { arrowBackOutline, calendarOutline, locationOutline, sparklesOutline, cloudOfflineOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { VariableItem } from './PredictionSelection';
import { predictionService, PredictionResultData } from '../../services/predictionService';
import { locationService } from '../../services/locationService';
import { showWarningAlert } from '../../utils/sweetAlert';
import './Predictions.css';

const CONTAMINATION_GASES = [
    { id: 'co2', name: 'Dióxido de Carbono (CO₂)' },
    { id: 'co', name: 'Monóxido de Carbono (CO)' },
    { id: 'both', name: 'Ambos Gases (CO y CO₂)' }
];

const PredictionConfig: React.FC = () => {
    const history = useHistory();
    const location = useLocation<{ variable?: VariableItem }>();
    const selectedVariable = location.state?.variable || { id: 'humedad', name: 'Humedad', unit: '%', icon: '' };

    const [zones, setZones] = useState<string[]>([]);
    const [selectedZone, setSelectedZone] = useState<string>('');
    const [selectedGas, setSelectedGas] = useState<string>('co2');

    // Cargar las ubicaciones reales registradas en la aplicación
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const data = await locationService.getUbicaciones();
                if (data && data.length > 0) {
                    const zoneList = data.map(u => {
                        const city = u.nombre_ubicacion || 'Zona';
                        const desc = u.descripcion || '';
                        return desc ? `${city} - ${desc}` : city;
                    });
                    setZones(zoneList);
                    setSelectedZone(zoneList[0]);
                    return;
                }
            } catch (err) {
                console.error("Error al obtener ubicaciones para predicción:", err);
            }

            const defaultZones = [
                'Cordoba 2 - Federal, Córdoba, Veracruz',
                'Cuitlahuac - San Pedro, Cuitláhuac, Veracruz',
                'Guadalajara - Parque zona dos',
                'Cordoba - Ex-Hacienda Toxpan'
            ];
            setZones(defaultZones);
            setSelectedZone(defaultZones[0]);
        };

        fetchZones();
    }, []);

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];

    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 15);
    const maxDate = futureDate.toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState<string>(minDate);

    // Hook useIonLoading para el estado de carga
    const [presentLoading, dismissLoading] = useIonLoading();

    const handleGeneratePrediction = async () => {
        if (!selectedZone) {
            showWarningAlert("Zona requerida", "Por favor selecciona una zona de monitoreo.");
            return;
        }

        // Spinner con el mensaje requerido durante 2.5 segundos
        await presentLoading({
            message: 'Analizando patrones climáticos...',
            spinner: 'crescent',
            duration: 2500,
            cssClass: 'custom-loading'
        });

        const fechaPayload = selectedDate.split('T')[0];
        let apiPredictionResult: PredictionResultData | null = null;
        let dualGasResult: { coData?: PredictionResultData; co2Data?: PredictionResultData } | null = null;

        try {
            switch (selectedVariable.id) {
                case 'temperatura':
                    apiPredictionResult = await predictionService.predecirTemperatura(fechaPayload);
                    break;
                case 'humedad':
                    apiPredictionResult = await predictionService.predecirHumedad(fechaPayload);
                    break;
                case 'radiacion':
                    apiPredictionResult = await predictionService.predecirRadiacion(fechaPayload);
                    break;
                case 'viento':
                    apiPredictionResult = await predictionService.predecirViento(fechaPayload);
                    break;
                case 'presion':
                    apiPredictionResult = await predictionService.predecirPresion(fechaPayload);
                    break;
                case 'contaminacion':
                    if (selectedGas === 'co') {
                        apiPredictionResult = await predictionService.predecirCO(fechaPayload);
                    } else if (selectedGas === 'co2') {
                        apiPredictionResult = await predictionService.predecirCO2(fechaPayload);
                    } else if (selectedGas === 'both') {
                        const [coData, co2Data] = await Promise.all([
                            predictionService.predecirCO(fechaPayload).catch(() => null),
                            predictionService.predecirCO2(fechaPayload).catch(() => null)
                        ]);
                        dualGasResult = { coData: coData || undefined, co2Data: co2Data || undefined };
                    }
                    break;
                default:
                    apiPredictionResult = await predictionService.predecirHumedad(fechaPayload);
                    break;
            }
        } catch (error: any) {
            console.error("Error al consumir API de predicción:", error);
        }

        setTimeout(() => {
            dismissLoading();

            // Navegar a los resultados con el objeto completo de respuesta
            history.push({
                pathname: '/prediction-result',
                state: {
                    variable: selectedVariable,
                    zone: selectedZone,
                    date: fechaPayload,
                    selectedGas,
                    apiPredictionResult,
                    dualGasResult
                }
            });
        }, 2500);
    };

    return (
        <IonPage>
            <IonContent className="prediction-container" scrollY={true}>
                <div className="prediction-header-bg">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/prediction-selection" icon={arrowBackOutline} className="back-btn" text="" />
                    </IonButtons>
                </div>

                <div className="prediction-white-card">
                    <h1 className="prediction-main-title">Configuración de Predicción</h1>
                    <p className="prediction-subtitle">
                        Paso 2 de 3: Parámetros para <strong>{selectedVariable.name}</strong>
                    </p>

                    <div className="config-group">
                        <label className="config-label">
                            <IonIcon icon={locationOutline} style={{ marginRight: '6px' }} />
                            Zona de Monitoreo
                        </label>
                        <div className="custom-select-box">
                            <IonSelect
                                value={selectedZone}
                                placeholder="Selecciona una zona"
                                onIonChange={e => setSelectedZone(e.detail.value)}
                                interface="action-sheet"
                                cancelText="Cancelar"
                                okText="Aceptar"
                            >
                                {zones.map((zoneName, idx) => (
                                    <IonSelectOption key={idx} value={zoneName}>
                                        {zoneName}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </div>
                    </div>

                    {selectedVariable.id === 'contaminacion' && (
                        <div className="config-group">
                            <label className="config-label">
                                <IonIcon icon={cloudOfflineOutline} style={{ marginRight: '6px' }} />
                                Gas Contaminante a Predecir
                            </label>
                            <div className="custom-select-box">
                                <IonSelect
                                    value={selectedGas}
                                    placeholder="Selecciona el gas"
                                    onIonChange={e => setSelectedGas(e.detail.value)}
                                    interface="action-sheet"
                                    cancelText="Cancelar"
                                    okText="Aceptar"
                                >
                                    {CONTAMINATION_GASES.map(gas => (
                                        <IonSelectOption key={gas.id} value={gas.id}>
                                            {gas.name}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </div>
                        </div>
                    )}

                    <div className="config-group">
                        <label className="config-label">
                            <IonIcon icon={calendarOutline} style={{ marginRight: '6px' }} />
                            Fecha de Predicción (Máx 15 días a futuro)
                        </label>
                        <div className="datetime-container">
                            <IonDatetime
                                presentation="date"
                                min={minDate}
                                max={maxDate}
                                value={selectedDate}
                                onIonChange={e => {
                                    const val = e.detail.value;
                                    if (typeof val === 'string') {
                                        setSelectedDate(val.split('T')[0]);
                                    }
                                }}
                                className="custom-datetime"
                                preferWheel={false}
                            />
                        </div>
                    </div>

                    <IonButton
                        expand="block"
                        className="generate-btn"
                        mode="ios"
                        onClick={handleGeneratePrediction}
                    >
                        <IonIcon slot="start" icon={sparklesOutline} />
                        Generar Predicción
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PredictionConfig;
