import React, { useState, useEffect } from 'react';
import {
    IonContent, IonPage, IonButtons, IonBackButton,
    IonSpinner, IonRefresher, IonRefresherContent, useIonViewWillEnter
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { locationService, Ubicacion } from '../../services/locationService';
import './Locations.css';

const Locations: React.FC = () => {
    const history = useHistory();
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarUbicaciones = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await locationService.getUbicaciones();
            setUbicaciones(data);
        } catch (err: any) {
            console.error("Error al cargar ubicaciones desde API:", err);
            setError("No se pudieron cargar las zonas de monitoreo.");
        } finally {
            setCargando(false);
        }
    };

    // Recargar automáticamente cada vez que la vista se muestra en pantalla
    useIonViewWillEnter(() => {
        cargarUbicaciones();
    });

    useEffect(() => {
        cargarUbicaciones();
    }, []);

    const handleRefresh = async (event: CustomEvent) => {
        await cargarUbicaciones();
        event.detail.complete();
    };

    const goToDetails = (u: Ubicacion) => {
        history.push({
            pathname: '/city-details',
            state: { locationData: u }
        });
    };

    // Agrupar ubicaciones por nombre de ciudad / zona (nombre_ubicacion)
    const groupedUbicaciones = ubicaciones.reduce((acc, curr) => {
        const zoneName = curr.nombre_ubicacion || 'Zona General';
        if (!acc[zoneName]) {
            acc[zoneName] = [];
        }
        acc[zoneName].push(curr);
        return acc;
    }, {} as Record<string, Ubicacion[]>);

    return (
        <IonPage>
            <IonContent className="locations-container" scrollY={true}>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent pullingText="Desliza para actualizar..." refreshingSpinner="crescent" />
                </IonRefresher>

                <div className="locations-header-bg">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" icon={arrowBackOutline} className="back-btn" text="" />
                    </IonButtons>
                </div>

                <div className="locations-white-card">
                    <h1 className="locations-main-title">Ubicaciones de monitoreo</h1>

                    {cargando ? (
                        <div className="loading-box">
                            <IonSpinner name="crescent" color="primary" />
                            <p style={{ marginTop: '10px', color: '#666' }}>Cargando zonas de monitoreo...</p>
                        </div>
                    ) : error ? (
                        <div className="error-box">
                            <p style={{ color: '#d9534f' }}>{error}</p>
                            <button className="retry-btn" onClick={cargarUbicaciones}>Reintentar</button>
                        </div>
                    ) : Object.keys(groupedUbicaciones).length === 0 ? (
                        <div className="empty-box">
                            <p style={{ color: '#888' }}>No hay zonas registradas actualmente.</p>
                        </div>
                    ) : (
                        Object.entries(groupedUbicaciones).map(([zoneName, items]) => (
                            <div className="city-section" key={zoneName}>
                                <h2 className="city-name">{zoneName}</h2>

                                {items.map((u) => (
                                    <div
                                        key={u.id_ubicacion}
                                        className="location-item"
                                        onClick={() => goToDetails(u)}
                                    >
                                        <div className="location-item-title">{u.descripcion}</div>
                                        <div className="location-item-coords">
                                            <span>📍 Lat: {Number(u.latitud).toFixed(4)}, Lng: {Number(u.longitud).toFixed(4)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Locations;