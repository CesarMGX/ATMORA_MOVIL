import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonPage, IonButtons, IonBackButton, IonButton, IonInput, IonSpinner, IonIcon } from '@ionic/react';
import { arrowBackOutline, eyeOutline, eyeOffOutline, logOutOutline, cameraOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { authService } from '../../services/authService';
import { showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmDialog } from '../../utils/sweetAlert';
import './Profile.css';

const Profile: React.FC = () => {
    const history = useHistory();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [userName, setUserName] = useState('Usuario');
    const [userEmail, setUserEmail] = useState('');
    const [userImage, setUserImage] = useState('https://cdn-icons-png.flaticon.com/512/147/147144.png');
    const [newPassword, setNewPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [subiendoFoto, setSubiendoFoto] = useState(false);

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');
        const storedImage = localStorage.getItem('userImage');

        if (storedId) setUserId(Number(storedId));
        if (storedName) setUserName(storedName);
        if (storedEmail) setUserEmail(storedEmail);
        if (storedImage) setUserImage(storedImage);
    }, []);

    const handleAvatarClick = () => {
        if (!subiendoFoto && !cargando) {
            fileInputRef.current?.click();
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar formato de imagen
        if (!file.type.startsWith('image/')) {
            showWarningAlert("Formato no válido", "Por favor selecciona un archivo de imagen (PNG, JPG, JPEG, WEBP).");
            return;
        }

        // Validar tamaño máximo de 5MB
        if (file.size > 5 * 1024 * 1024) {
            showWarningAlert("Imagen muy grande", "La foto no debe superar los 5MB.");
            return;
        }

        setSubiendoFoto(true);
        try {
            // Consumir nuevo endpoint PUT /api/usuarios/perfil/foto con Cloudinary
            const secureUrl = await authService.uploadProfilePhoto(file);
            
            // Actualizar estado local y localStorage
            setUserImage(secureUrl);
            localStorage.setItem('userImage', secureUrl);

            if (userId) {
                authService.saveSession({
                    id: userId,
                    nombre: userName,
                    correo: userEmail
                }, secureUrl);
            }

            showSuccessAlert("¡Foto actualizada!", "Tu foto de perfil se ha actualizado correctamente.");
        } catch (error: any) {
            console.error("Error al actualizar la foto de perfil:", error);
            showErrorAlert("Error al actualizar la foto", error.message || "No se pudo actualizar la foto de perfil.");
        } finally {
            setSubiendoFoto(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSaveProfile = async () => {
        if (!userName.trim() || !userEmail.trim()) {
            showWarningAlert("Campos requeridos", "El nombre y correo no pueden estar vacíos.");
            return;
        }

        // Validación precisa de las contraseñas
        if (newPassword || verifyPassword) {
            if (newPassword !== verifyPassword) {
                showErrorAlert("Error en contraseña", "Las contraseñas no coinciden.");
                return;
            }
            if (newPassword.length < 6) {
                showWarningAlert("Contraseña muy corta", "La nueva contraseña debe tener al menos 6 caracteres.");
                return;
            }
        }

        if (!userId) {
            showErrorAlert("Sesión no válida", "No se encontró el ID del usuario activo. Por favor, vuelve a iniciar sesión.");
            return;
        }

        setCargando(true);
        try {
            const updatePayload: { nombre: string; correo: string; password?: string } = {
                nombre: userName.trim(),
                correo: userEmail.trim().toLowerCase()
            };

            if (newPassword) {
                updatePayload.password = newPassword;
            }

            const updatedUser = await authService.updateUserProfile(userId, updatePayload);

            const userToSave = {
                ...updatedUser,
                id: updatedUser.id || userId
            };

            authService.saveSession(userToSave, userImage);
            setNewPassword('');
            setVerifyPassword('');
            showSuccessAlert("¡Perfil actualizado!", "Tus datos han sido actualizados correctamente.");
        } catch (error: any) {
            showErrorAlert("Error al actualizar", error.message || "Error al actualizar el perfil.");
        } finally {
            setCargando(false);
        }
    };

    const handleLogout = async () => {
        const confirmed = await showConfirmDialog(
            "¿Cerrar sesión?",
            "¿Estás seguro de que deseas cerrar tu sesión?",
            "Seguro",
            "Mejor me quedo"
        );

        if (confirmed) {
            authService.clearSession();
            showSuccessAlert("Sesión cerrada", "Has cerrado sesión exitosamente.");
            history.replace('/login');
        }
    };

    return (
        <IonPage>
            <IonContent className="profile-container" scrollY={true}>
                {/* Barra superior sticky con botón de atrás */}
                <div className="profile-sticky-nav">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" icon={arrowBackOutline} className="back-btn" text="" />
                    </IonButtons>
                </div>

                {/* Fondo celeste superior con Avatar e insignia de cámara */}
                <div className="profile-header-bg">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />

                    <div className="avatar-container">
                        <div 
                            className="avatar-circle" 
                            onClick={handleAvatarClick}
                            title="Toca para cambiar foto de perfil"
                        >
                            <img src={userImage} alt="Avatar" referrerPolicy="no-referrer" />
                            
                            {subiendoFoto ? (
                                <div className="avatar-loading-overlay">
                                    <IonSpinner name="crescent" color="light" />
                                </div>
                            ) : (
                                <div className="avatar-edit-badge" title="Cambiar foto">
                                    <IonIcon icon={cameraOutline} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tarjeta blanca de información */}
                <div className="profile-white-card">
                    <div className="profile-info-content">

                        {/* Campo Nombre */}
                        <div className="info-group">
                            <label className="user-label-display">Cambiar nombre</label>
                            <IonInput
                                className="custom-input profile-input"
                                value={userName}
                                disabled={cargando || subiendoFoto}
                                onIonInput={e => setUserName(e.detail.value || '')}
                            />
                        </div>

                        {/* Campo Correo */}
                        <div className="info-group">
                            <label className="user-label-display">Cambiar correo</label>
                            <IonInput
                                type="email"
                                className="custom-input profile-input"
                                value={userEmail}
                                disabled={cargando || subiendoFoto}
                                onIonInput={e => setUserEmail(e.detail.value || '')}
                            />
                        </div>

                        {/* Campo Contraseña */}
                        <div className="info-group">
                            <label className="user-label-display">Contraseña</label>
                            <div className="password-input-wrapper">
                                <IonInput
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="custom-input profile-input profile-input-password"
                                    placeholder="••••••"
                                    value={newPassword}
                                    disabled={cargando || subiendoFoto}
                                    onIonInput={e => setNewPassword(e.detail.value || '')}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    disabled={cargando || subiendoFoto}
                                >
                                    <IonIcon icon={showNewPassword ? eyeOffOutline : eyeOutline} />
                                </button>
                            </div>
                        </div>

                        {/* Campo Verificar */}
                        <div className="info-group">
                            <label className="user-label-display">Verificar contraseña</label>
                            <div className="password-input-wrapper">
                                <IonInput
                                    type={showVerifyPassword ? 'text' : 'password'}
                                    className="custom-input profile-input profile-input-password"
                                    placeholder="••••••"
                                    value={verifyPassword}
                                    disabled={cargando || subiendoFoto}
                                    onIonInput={e => setVerifyPassword(e.detail.value || '')}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                                    disabled={cargando || subiendoFoto}
                                >
                                    <IonIcon icon={showVerifyPassword ? eyeOffOutline : eyeOutline} />
                                </button>
                            </div>
                        </div>

                        {/* Botón Guardar */}
                        <IonButton 
                            expand="block" 
                            className="save-profile-btn" 
                            onClick={handleSaveProfile}
                            disabled={cargando || subiendoFoto}
                        >
                            {cargando ? <IonSpinner name="crescent" /> : 'Guardar'}
                        </IonButton>

                        {/* Botón Cerrar Sesión */}
                        <IonButton 
                            expand="block" 
                            fill="outline"
                            className="logout-profile-btn" 
                            onClick={handleLogout}
                            disabled={cargando || subiendoFoto}
                        >
                            <IonIcon slot="start" icon={logOutOutline} />
                            Cerrar sesión
                        </IonButton>

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Profile;