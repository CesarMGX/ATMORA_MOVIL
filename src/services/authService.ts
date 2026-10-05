export interface ApiUser {
  id?: number;
  id_usuario?: number;
  nombre: string;
  correo: string;
  password?: string;
  contrasena?: string;
  rol?: string;
  estado?: string;
  avatar?: string;
  fechaRegistro?: string;
  primerIngreso?: boolean;
}

const API_BASE_URL = 'https://atmoraweb-production.up.railway.app/api';

/**
 * Servicio de Autenticación para ATMORA-APP conectado con la API Backend
 */
export const authService = {
  /**
   * Inicia sesión verificando credenciales en el backend
   */
  async loginUser(correo: string, passwordInput: string): Promise<ApiUser> {
    const cleanEmail = correo.trim().toLowerCase();
    const response = await fetch(`${API_BASE_URL}/usuarios?correo=${encodeURIComponent(cleanEmail)}`);
    
    if (!response.ok) {
      throw new Error('Error de conexión con el servidor.');
    }

    const data: ApiUser[] = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('El correo electrónico no está registrado.');
    }

    // Buscar coincidencia de usuario
    const user = data.find(u => u.correo.toLowerCase() === cleanEmail);
    
    if (!user) {
      throw new Error('El correo electrónico no está registrado.');
    }

    // Verificar contraseña (la API puede devolver `password` o `contrasena`)
    const userPassword = user.password || user.contrasena || '';
    if (userPassword && userPassword !== passwordInput) {
      throw new Error('La contraseña es incorrecta.');
    }

    return user;
  },

  /**
   * Registra un nuevo usuario en la base de datos a través de la API
   */
  async registerUser(userData: { nombre: string; correo: string; password: string; rol?: string }): Promise<ApiUser> {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: userData.nombre.trim(),
        correo: userData.correo.trim().toLowerCase(),
        password: userData.password,
        rol: userData.rol || 'visualizador'
      })
    });

    const resJson = await response.json();

    if (!response.ok) {
      const errorMsg = resJson.message || 'No se pudo completar el registro.';
      throw new Error(errorMsg);
    }

    return resJson;
  },

  /**
   * Sincroniza un usuario autenticado con Google en la base de datos de la API
   */
  async syncGoogleUser(googleUser: { nombre: string; correo: string; photoURL?: string }): Promise<ApiUser> {
    const cleanEmail = googleUser.correo.trim().toLowerCase();

    // 1. Verificar si ya existe en la BD
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios?correo=${encodeURIComponent(cleanEmail)}`);
      if (response.ok) {
        const users: ApiUser[] = await response.json();
        const existingUser = users.find(u => u.correo.toLowerCase() === cleanEmail);
        if (existingUser) {
          return existingUser;
        }
      }
    } catch (e) {
      console.warn('No se pudo verificar usuario en BD, procediendo a registro:', e);
    }

    // 2. Si no existe, crearlo en la API
    return await this.registerUser({
      nombre: googleUser.nombre || 'Usuario Google',
      correo: cleanEmail,
      password: 'google_authenticated_oauth',
      rol: 'visualizador'
    });
  },

  /**
   * Actualiza la información de perfil del usuario en la base de datos
   */
  async updateUserProfile(userId: number, updateData: { nombre?: string; correo?: string; password?: string }): Promise<ApiUser> {
    const payload: any = { ...updateData };
    if (payload.password) {
      payload.contrasena = payload.password;
    }

    // Usamos PATCH para actualizar únicamente los campos modificados sin borrar otros
    let response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Fallback a PUT si el backend rechaza PATCH
      response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    const resJson = await response.json();
    if (!response.ok) {
      throw new Error(resJson.message || 'Error al actualizar el perfil en el servidor.');
    }

    return resJson;
  },

  /**
   * Subes o actualizas la foto de perfil del usuario a Cloudinary a través de la API
   * Endpoint: PUT /api/usuarios/perfil/foto
   * Content-Type: multipart/form-data (campo 'foto')
   */
  async uploadProfilePhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('foto', file);

    const response = await fetch(`${API_BASE_URL}/usuarios/perfil/foto`, {
      method: 'PUT',
      body: formData
    });

    const resJson = await response.json();

    if (!response.ok) {
      const errorMsg = resJson.message || 'No se pudo subir la imagen a Cloudinary.';
      throw new Error(errorMsg);
    }

    const secureUrl = resJson.secure_url || resJson.url || resJson.foto || resJson.data?.secure_url;
    if (!secureUrl) {
      throw new Error('No se obtuvo la URL segura de Cloudinary en la respuesta.');
    }

    return secureUrl;
  },

  /**
   * Guarda los datos de sesión activa en localStorage
   */
  saveSession(user: ApiUser, customImage?: string): void {
    const uId = user.id ?? user.id_usuario;
    const existingId = localStorage.getItem('userId');
    const finalId = uId ? uId.toString() : (existingId || '1');

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', finalId);
    localStorage.setItem('userName', user.nombre || 'Usuario');
    localStorage.setItem('userEmail', user.correo || '');
    if (user.rol) {
      localStorage.setItem('userRol', user.rol);
    }
    
    if (customImage) {
      localStorage.setItem('userImage', customImage);
    } else if (user.avatar) {
      localStorage.setItem('userImage', user.avatar);
    } else {
      localStorage.setItem('userImage', `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre || 'U')}&background=0f3460&color=fff`);
    }
  },

  /**
   * Elimina la sesión activa
   */
  clearSession(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userImage');
    localStorage.removeItem('userRol');
  }
};

