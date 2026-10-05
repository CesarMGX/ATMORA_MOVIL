import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonIcon, IonSpinner, createAnimation } from '@ionic/react';
import { arrowBack, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { authService } from '../../services/authService';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../../utils/sweetAlert';
import './Register.css';

const Register: React.FC = () => {
    const history = useHistory();
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [cargando, setCargando] = useState(false);

    const handleBack = () => {
        const card = document.querySelector('.register-card');
        if (card) {
            const animation = createAnimation()
                .addElement(card)
                .duration(250)
                .easing('ease-in')
                .fromTo('opacity', '1', '0')
                .fromTo('transform', 'translateY(0)', 'translateY(30px)');

            animation.play().then(() => {
                history.replace('/login');
            });
        } else {
            history.replace('/login');
        }
    };

    const handleRegister = async () => {
        if (!nombre.trim() || !correo.trim() || !password.trim() || !confirmPassword.trim()) {
            showWarningAlert("Campos requeridos", "Por favor, completa todos los campos.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
            showWarningAlert("Correo inválido", "Ingresa un correo electrónico válido.");
            return;
        }

        if (password !== confirmPassword) {
            showErrorAlert("Error en contraseña", "Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            showWarningAlert("Contraseña muy corta", "La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setCargando(true);
        try {
            const newUser = await authService.registerUser({
                nombre: nombre.trim(),
                correo: correo.trim(),
                password: password,
                rol: 'visualizador'
            });

            authService.saveSession(newUser);
            await showSuccessAlert("¡Registro exitoso!", "Bienvenido a ATMORA.");
            history.push('/home');
        } catch (error: any) {
            showErrorAlert("Error al registrar", error.message || "Error al registrar el usuario.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <IonPage>
            <IonContent className="register-container" scrollY={true}>
                {/* Contenedor de la barra superior respeta el safe area del reloj/barra de estado del celular */}
                <div className="register-header-nav">
                    <div className="back-button" onClick={handleBack}>
                        <IonIcon icon={arrowBack} />
                    </div>
                </div>

                <div className="register-card">
                    <h1 className="register-title">Regístrate!!</h1>

                    <div className="input-group">
                        <label className="custom-label">NOMBRE COMPLETO</label>
                        <IonInput 
                            className="custom-input" 
                            placeholder="Ej. Juan Pérez" 
                            mode="md"
                            value={nombre}
                            disabled={cargando}
                            onIonChange={e => setNombre(e.detail.value!)}
                        />
                    </div>

                    <div className="input-group">
                        <label className="custom-label">CORREO ELECTRÓNICO</label>
                        <IonInput 
                            type="email" 
                            className="custom-input" 
                            placeholder="correo@ejemplo.com" 
                            mode="md" 
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
                                placeholder="••••••••" 
                                mode="md"
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

                    <div className="input-group">
                        <label className="custom-label">VERIFICAR CONTRASEÑA</label>
                        <div className="password-input-wrapper">
                            <IonInput 
                                type={showConfirmPassword ? 'text' : 'password'} 
                                className="custom-input" 
                                placeholder="••••••••" 
                                mode="md"
                                value={confirmPassword}
                                disabled={cargando}
                                onIonInput={e => setConfirmPassword(e.detail.value || '')}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={cargando}
                            >
                                <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                            </button>
                        </div>
                    </div>

                    <IonButton 
                        expand="block" 
                        className="orange-button" 
                        mode="ios" 
                        onClick={handleRegister} 
                        disabled={cargando}
                    >
                        {cargando ? <IonSpinner name="crescent" /> : 'Registrarte'}
                    </IonButton>
                </div>

                <div className="bottom-wave"></div>
            </IonContent>
        </IonPage>
    );
};

export default Register;