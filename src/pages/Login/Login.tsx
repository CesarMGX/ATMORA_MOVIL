import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonInput, IonButton, createAnimation, useIonViewWillEnter, IonIcon, IonSpinner } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logoGoogle, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { authService } from '../../services/authService';
import { showSuccessAlert, showErrorAlert, showWarningAlert, showInfoAlert } from '../../utils/sweetAlert';

import './Login.css';

const Login: React.FC = () => {
    const history = useHistory();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (Capacitor.getPlatform() !== 'web') {
            GoogleAuth.initialize({
                clientId: '260943439033-s02n43med5qq3mkdb8bdje110q39kt97.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
                grantOfflineAccess: false,
            });
        }
    }, []);

    useIonViewWillEnter(() => {
        const card = document.querySelector('.login-card');
        if (card) {
            (card as HTMLElement).style.setProperty('opacity', '1', 'important');
            (card as HTMLElement).style.setProperty('transform', 'translateY(0)', 'important');
        }
    });

    const handleLogin = async () => {
        if (!correo.trim() || !password.trim()) {
            showWarningAlert("Campos incompletos", "Por favor ingresa tu correo y contraseña.");
            return;
        }

        setCargando(true);
        try {
            const apiUser = await authService.loginUser(correo, password);
            authService.saveSession(apiUser);
            await showSuccessAlert("¡Bienvenido!", `Has iniciado sesión exitosamente.`);
            history.push('/home');
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            showErrorAlert("Error de acceso", error.message || "Correo o contraseña incorrectos.");
        } finally {
            setCargando(false);
        }
    };

    const handleGoogleLogin = async () => {
        // Verificación estricta de conexión a Internet previa a conectar con Google
        if (!navigator.onLine) {
            showWarningAlert(
                "Sin conexión a Internet",
                "Por favor conéctate a una red Wi-Fi o datos móviles para ingresar con Google."
            );
            return;
        }

        setCargando(true);
        try {
            let name = '';
            let email = '';
            let image = '';

            if (Capacitor.getPlatform() === 'web') {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                name = result.user.displayName || 'Usuario Google';
                email = result.user.email || '';
                image = result.user.photoURL || '';
            } else {
                const googleUser: any = await GoogleAuth.signIn();
                if (googleUser) {
                    name = googleUser.displayName || googleUser.givenName || 'Usuario Google';
                    email = googleUser.email || '';
                    image = googleUser.imageUrl || '';
                }
            }

            if (!email) {
                throw new Error("No se pudo obtener el correo de Google.");
            }

            // Sincronizar usuario con la API de PostgreSQL
            const apiUser = await authService.syncGoogleUser({
                nombre: name,
                correo: email,
                photoURL: image
            });

            authService.saveSession(apiUser, image);
            await showSuccessAlert("¡Bienvenido!", `Has iniciado sesión exitosamente con Google.`);
            history.push('/home');
        } catch (error: any) {
            console.error("Error al conectar con Google:", error);
            const errString = typeof error === 'object' ? JSON.stringify(error) : String(error);
            const errMessage = (error?.message || error?.error || errString || '').toLowerCase();
            const errCode = String(error?.code || '');

            // Detectar falta de red o errores de servidor sin conexión
            if (!navigator.onLine || errMessage.includes('network') || errMessage.includes('offline') || errMessage.includes('failed to fetch') || errCode === '7') {
                showWarningAlert(
                    "Sin conexión a Internet",
                    "Por favor conéctate a una red Wi-Fi o datos móviles para ingresar con Google."
                );
            } else if (
                error?.code === 'auth/popup-closed-by-user' ||
                errMessage.includes('popup_closed_by_user') ||
                errMessage.includes('user canceled') ||
                errMessage.includes('canceled') ||
                errMessage.includes('12501')
            ) {
                showInfoAlert("Cancelado", "Inicio de sesión con Google cancelado.");
            } else {
                showErrorAlert("Error con Google", error?.message || error?.error || "No se pudo autenticar con Google.");
            }
        } finally {
            setCargando(false);
        }
    };

    const handleRegisterClick = () => {
        const card = document.querySelector('.login-card');
        if (card) {
            const animation = createAnimation()
                .addElement(card)
                .duration(300)
                .fromTo('opacity', '1', '0')
                .fromTo('transform', 'translateY(0)', 'translateY(40px)');
            animation.play().then(() => history.push('/register'));
        } else {
            history.push('/register');
        }
    };

    return (
        <IonPage>
            <IonContent className="login-container" scrollY={false}>
                <div className="top-background"></div>
                <div className="login-card">
                    <div className="logo-box">
                        <img src="/assets/logo_transparente.png" alt="Atmora" className="login-logo" />
                    </div>
                    <h1 className="login-title">Iniciar sesión</h1>

                    <div className="input-group">
                        <label className="custom-label">CORREO ELECTRÓNICO</label>
                        <IonInput
                            type="email"
                            className="custom-input"
                            placeholder="correo@ejemplo.com"
                            value={correo}
                            disabled={cargando}
                            onIonChange={e => setCorreo(e.detail.value!)}
                        />
                    </div>

                    <div className="input-group">
                        <label className="custom-label">CONTRASEÑA</label>
                        <div className="password-input-wrapper">
                            <IonInput
                                type={showPassword ? 'text' : 'password'}
                                className="custom-input"
                                placeholder="••••••"
                                value={password}
                                disabled={cargando}
                                onIonInput={e => setPassword(e.detail.value || '')}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={cargando}
                            >
                                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                            </button>
                        </div>
                    </div>

                    <IonButton expand="block" className="orange-button" onClick={handleLogin} disabled={cargando}>
                        {cargando ? <IonSpinner name="crescent" /> : 'Iniciar Sesión'}
                    </IonButton>

                    <div className="separator">O continúa con</div>

                    <IonButton expand="block" fill="outline" className="google-button" onClick={handleGoogleLogin} disabled={cargando}>
                        <IonIcon slot="start" icon={logoGoogle} />
                        Google
                    </IonButton>

                    <div className="login-footer">
                        <p>¿No tienes cuenta?</p>
                        <span className="register-link" onClick={handleRegisterClick}>
                            Regístrate aquí
                        </span>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;