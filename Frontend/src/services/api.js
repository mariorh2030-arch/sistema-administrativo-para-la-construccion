const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    // Token vencido o inválido: cerrar sesión (menos en el login, donde 401 = contraseña mala)
    if (response.status === 401 && path !== '/auth/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }
    return data;
}

const api = {
    login: (email, password) =>
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    // Aquí irán obras, proveedores, facturas... usando request()
};

export default api;