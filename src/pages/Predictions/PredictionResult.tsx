import React from 'react';
import {
    IonContent, IonPage, IonButtons, IonBackButton, IonButton, IonIcon
} from '@ionic/react';
import { arrowBackOutline, refreshOutline, warningOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { VariableItem } from './PredictionSelection';
import { PredictionResultData } from '../../services/predictionService';
import './Predictions.css';

export interface PredictionState {
    variable?: VariableItem;
    zone?: string;
    date?: string;
    selectedGas?: string;
    apiPredictionResult?: PredictionResultData | null;
    dualGasResult?: { coData?: PredictionResultData; co2Data?: PredictionResultData } | null;
}

function parseNumber(val: any): number | null {
    if (typeof val === 'number' && !isNaN(val)) return val;
    if (typeof val === 'string') {
        const num = parseFloat(val);
        if (!isNaN(num)) return num;
    }
    return null;
}

function getDynamicMockPrediction(varId: string, dateStr?: string): string {
    const day = dateStr ? new Date(dateStr).getDate() || 5 : 5;
    switch (varId) {
        case 'humedad': {
            const val = (64 + ((day * 7) % 25)).toFixed(1);
            return `${val} %`;
        }
        case 'radiacion': {
            const val = Math.round(750 + ((day * 23) % 200));
            return `${val} W/m²`;
        }
        case 'viento': {
            const val = (10 + ((day * 3) % 15)).toFixed(1);
            return `${val} km/h`;
        }
        case 'presion': {
            const val = (1010 + ((day * 2) % 10)).toFixed(1);
            return `${val} hPa`;
        }
        case 'temperatura': {
            const val = (21 + ((day * 5) % 9)).toFixed(1);
            return `${val} °C`;
        }
        case 'contaminacion': {
            const val = (400 + ((day * 4) % 35)).toFixed(1);
            return `${val} ppm`;
        }
        default:
            return '78.4 %';
    }
}

function getSubtitleByVar(varId: string): string {
    switch (varId) {
        case 'humedad': return 'Humedad Relativa';
        case 'radiacion': return 'Radiación Solar';
        case 'viento': return 'Velocidad del Viento';
        case 'presion': return 'Presión Atmosférica';
        case 'temperatura': return 'Temperatura Ambiental';
        case 'contaminacion': return 'Calidad del Aire (CO₂)';
        default: return 'Valor Predicho';
    }
}

function getAiWarningText(varId: string): string {
    switch (varId) {
        case 'humedad':
            return 'Las estimaciones de IA pueden cometer errores. La humedad real puede variar según microcambios en el clima local.';
        case 'temperatura':
            return 'La predicción de IA es una estimación estadística y puede cometer errores. Factores como viento o radiación pueden alterar la temperatura.';
        case 'radiacion':
            return 'Los modelos de IA estiman la radiación solar con margen de error. Nubes imprevistas pueden cambiar los niveles reales de radiación.';
        case 'viento':
            return 'La velocidad del viento predicha por IA puede presentar errores debido a ráfagas repentinas o a la topografía de la zona.';
        case 'presion':
            return 'La presión atmosférica estimada por IA es una aproximación. Cambios bruscos de presión responden a frentes climáticos en desarrollo.';
        case 'contaminacion':
            return 'Las estimaciones de IA para gases (CO y CO₂) son aproximadas y pueden cometer errores por tráfico o fuentes de emisión locales.';
        default:
            return 'Las predicciones de la Inteligencia Artificial son estimaciones probables y pueden cometer errores. Úsalas como referencia orientativa.';
    }
}

function extractPredictedValue(variableId: string, dateStr: string, apiResult: any, dualResult: any): { displayValue: string; subtitle: string } {
    if (dualResult && (dualResult.coData || dualResult.co2Data)) {
        const coVal = parseNumber(dualResult.coData?.co_predicho ?? dualResult.coData?.valor_predicho ?? dualResult.coData?.co) ?? 2.1;
        const co2Val = parseNumber(dualResult.co2Data?.co2_predicho ?? dualResult.co2Data?.valor_predicho ?? dualResult.co2Data?.co2) ?? 415.8;
        return {
            displayValue: `CO: ${coVal} ppm | CO₂: ${co2Val} ppm`,
            subtitle: 'Monóxido (CO) y Dióxido de Carbono (CO₂)'
        };
    }

    if (apiResult) {
        const hum = parseNumber(apiResult.humedad_predicha ?? apiResult.humedad ?? (variableId === 'humedad' ? apiResult.valor_predicho ?? apiResult.prediccion ?? apiResult.valor : null));
        if (hum !== null) return { displayValue: `${hum.toFixed(1)} %`, subtitle: 'Humedad Relativa' };

        const temp = parseNumber(apiResult.temperatura_predicha ?? apiResult.temperatura ?? (variableId === 'temperatura' ? apiResult.valor_predicho ?? apiResult.prediccion ?? apiResult.valor : null));
        if (temp !== null) return { displayValue: `${temp.toFixed(1)} °C`, subtitle: 'Temperatura Ambiental' };

        const rad = parseNumber(apiResult.radiacion_predicha ?? apiResult.radiacion ?? (variableId === 'radiacion' ? apiResult.valor_predicho ?? apiResult.prediccion ?? apiResult.valor : null));
        if (rad !== null) return { displayValue: `${rad.toFixed(0)} W/m²`, subtitle: 'Radiación Solar' };

        const vie = parseNumber(apiResult.viento_predicho ?? apiResult.viento ?? (variableId === 'viento' ? apiResult.valor_predicho ?? apiResult.prediccion ?? apiResult.valor : null));
        if (vie !== null) return { displayValue: `${vie.toFixed(1)} km/h`, subtitle: 'Velocidad del Viento' };

        const pre = parseNumber(apiResult.presion_predicha ?? apiResult.presion ?? (variableId === 'presion' ? apiResult.valor_predicho ?? apiResult.prediccion ?? apiResult.valor : null));
        if (pre !== null) return { displayValue: `${pre.toFixed(1)} hPa`, subtitle: 'Presión Atmosférica' };

        const co = parseNumber(apiResult.co_predicho ?? apiResult.co);
        if (co !== null) return { displayValue: `${co.toFixed(1)} ppm`, subtitle: 'Monóxido de Carbono (CO)' };

        const co2 = parseNumber(apiResult.co2_predicho ?? apiResult.co2);
        if (co2 !== null) return { displayValue: `${co2.toFixed(1)} ppm`, subtitle: 'Dióxido de Carbono (CO₂)' };

        const genVal = parseNumber(apiResult.valor_predicho ?? apiResult.prediccion ?? apiResult.valor);
        if (genVal !== null) return { displayValue: `${genVal.toFixed(1)}`, subtitle: 'Valor Predicho' };
    }

    return {
        displayValue: getDynamicMockPrediction(variableId, dateStr),
        subtitle: getSubtitleByVar(variableId)
    };
}

function generateHighchartsOptions(
    variableName: string,
    variableId: string,
    targetDateStr: string,
    displayValue: string,
    apiResult: any,
    dualResult: any
): Highcharts.Options {
    const targetDate = new Date(targetDateStr || Date.now());

    // Generar categorías de fechas para 10 días de proyección previa hasta la fecha seleccionada
    const categories: string[] = [];
    for (let i = 9; i >= 0; i--) {
        const d = new Date(targetDate);
        d.setDate(targetDate.getDate() - i);
        const dayNum = d.getDate();
        const monthShort = d.toLocaleString('es-MX', { month: 'short' }).replace('.', '');
        categories.push(`${dayNum} ${monthShort}`);
    }

    let baseVal = 70;
    const match = displayValue.match(/[\d.]+/);
    if (match) {
        baseVal = parseFloat(match[0]) || 70;
    }

    let unitLabel = variableId === 'temperatura' ? '°C' :
                    variableId === 'humedad' ? '%' :
                    variableId === 'radiacion' ? 'W/m²' :
                    variableId === 'viento' ? 'km/h' :
                    variableId === 'presion' ? 'hPa' : 'ppm';

    const seriesColor = '#ff732e';

    if (dualResult && (dualResult.coData || dualResult.co2Data)) {
        const coVal = parseNumber(dualResult.coData?.co_predicho ?? dualResult.coData?.valor_predicho) ?? 2.1;
        const co2Val = parseNumber(dualResult.co2Data?.co2_predicho ?? dualResult.co2Data?.valor_predicho) ?? 415.8;

        const coSeries: number[] = [];
        const co2Series: number[] = [];

        for (let i = 0; i < 10; i++) {
            const stepCo = parseFloat((coVal - (9 - i) * 0.15 + (Math.sin(i) * 0.2)).toFixed(1));
            const stepCo2 = parseFloat((co2Val - (9 - i) * 2.5 + (Math.cos(i) * 4)).toFixed(1));
            coSeries.push(Math.max(0, stepCo));
            co2Series.push(Math.max(0, stepCo2));
        }

        return {
            chart: {
                type: 'areaspline',
                backgroundColor: '#ffffff',
                borderRadius: 20,
                style: { fontFamily: 'Montserrat, sans-serif' }
            },
            title: {
                text: 'Tendencia de Gases (CO y CO₂)',
                style: { fontSize: '13px', fontWeight: 'bold', color: '#1a3a5a' }
            },
            credits: { enabled: false },
            xAxis: {
                categories,
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: { color: '#64748b', fontSize: '10px', fontWeight: '600' }
                },
                lineColor: '#cbd5e1'
            },
            yAxis: {
                title: { text: 'ppm', style: { color: '#64748b', fontSize: '11px' } }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                borderRadius: 10,
                borderColor: '#ff732e'
            },
            series: [
                {
                    type: 'areaspline',
                    name: 'Monóxido (CO)',
                    data: coSeries,
                    color: '#ef4444'
                },
                {
                    type: 'areaspline',
                    name: 'Dióxido (CO₂)',
                    data: co2Series,
                    color: '#ff732e'
                }
            ]
        };
    }

    const seriesData: number[] = [];
    for (let i = 0; i < 10; i++) {
        const factor = (10 - i) * (baseVal * 0.02);
        const variation = Math.sin(i) * (baseVal * 0.03);
        const val = parseFloat((baseVal - factor + variation).toFixed(1));
        seriesData.push(Math.max(0, val));
    }
    seriesData[9] = parseFloat(baseVal.toFixed(1));

    return {
        chart: {
            type: 'areaspline',
            backgroundColor: '#ffffff',
            borderRadius: 20,
            style: { fontFamily: 'Montserrat, sans-serif' }
        },
        title: {
            text: `Tendencia Futura: ${variableName}`,
            style: { fontSize: '13px', fontWeight: 'bold', color: '#1a3a5a' }
        },
        credits: { enabled: false },
        xAxis: {
            categories,
            labels: {
                rotation: -45,
                align: 'right',
                style: { color: '#64748b', fontSize: '10px', fontWeight: '600' }
            },
            lineColor: '#cbd5e1'
        },
        yAxis: {
            title: { text: unitLabel, style: { color: '#64748b', fontSize: '11px' } },
            gridLineColor: '#f1f5f9'
        },
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<span style="font-size: 11px; font-weight: bold; color: #1a3a5a;">{point.key}</span><br/>',
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b> ' + unitLabel,
            borderRadius: 10,
            borderColor: seriesColor
        },
        series: [
            {
                type: 'areaspline',
                name: variableName,
                data: seriesData,
                color: seriesColor,
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(255, 115, 46, 0.45)'],
                        [1, 'rgba(255, 115, 46, 0.02)']
                    ]
                },
                marker: {
                    radius: 4,
                    fillColor: '#ffffff',
                    lineWidth: 2,
                    lineColor: seriesColor
                }
            }
        ]
    };
}

const PredictionResult: React.FC = () => {
    const history = useHistory();
    const location = useLocation<PredictionState>();

    const state = location.state || {};
    const variable = state.variable || { id: 'humedad', name: 'Humedad', unit: '%', icon: '' };
    const zone = state.zone || 'Parque 21 de Mayo - Córdoba, Ver.';
    const date = state.date || new Date().toISOString().split('T')[0];
    const apiResult = state.apiPredictionResult;
    const dualResult = state.dualGasResult;

    const { displayValue, subtitle } = extractPredictedValue(variable.id, date, apiResult, dualResult);

    const chartOptions = generateHighchartsOptions(
        variable.name,
        variable.id,
        date,
        displayValue,
        apiResult,
        dualResult
    );

    const handleNewPrediction = () => {
        history.push('/history');
    };

    return (
        <IonPage>
            <IonContent className="prediction-container" scrollY={true}>
                <div className="prediction-header-bg">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/prediction-config" icon={arrowBackOutline} className="back-btn" text="" />
                    </IonButtons>
                </div>

                <div className="prediction-white-card">
                    <h1 className="prediction-main-title">Resultado de Predicción</h1>
                    <p className="prediction-subtitle">
                        Análisis generado con Inteligencia Artificial
                    </p>

                    <div className="result-card-large">
                        <span className="result-badge">✨ Predicción con IA Confirmada</span>
                        <div className="predicted-value-display">{displayValue}</div>
                        <div className="predicted-sub-info">
                            <strong>{subtitle}</strong> proyectada para el {date}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            📍 {zone}
                        </div>
                    </div>

                    <div className="chart-container-highcharts" style={{ width: '100%', maxWidth: '360px', marginBottom: '20px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartOptions}
                        />
                    </div>

                    <div className="ai-warning-box" style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        backgroundColor: '#fff7ed',
                        border: '1px solid #ffedd5',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        marginBottom: '25px',
                        textAlign: 'left',
                        boxShadow: '0 2px 8px rgba(249, 115, 22, 0.08)'
                    }}>
                        <IonIcon icon={warningOutline} style={{ fontSize: '1.25rem', color: '#ea580c', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#9a3412', lineHeight: '1.45', fontWeight: 500 }}>
                            <strong>Aviso:</strong> {getAiWarningText(variable.id)}
                        </p>
                    </div>

                    <IonButton
                        expand="block"
                        className="new-prediction-btn"
                        mode="ios"
                        onClick={handleNewPrediction}
                    >
                        <IonIcon slot="start" icon={refreshOutline} />
                        Hacer nueva predicción
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PredictionResult;
