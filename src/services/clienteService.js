import api from './api';
import axios from 'axios';

// Crear una instancia de axios pública (sin autenticación)
const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ==================== SERVICIOS CLIENTE ====================

export const clienteService = {
  // Obtener puntos actuales y resumen
  getMisPuntos: async () => {
    const response = await api.get('/cliente/puntos');
    return response.data;
  },

  // Obtener historial de transacciones
  getMiHistorial: async (tipo = null) => {
    const params = tipo ? { tipo } : {};
    const response = await api.get('/cliente/historial', { params });
    return response.data;
  },

  // Obtener todos mis canjes (pendientes y completados)
  getMisCanjes: async () => {
    const response = await api.get('/cliente/mis-canjes');
    return response.data;
  },

  // Obtener solo canjes pendientes
  getCanjesPendientes: async () => {
    const response = await api.get('/cliente/canjes-pendientes');
    return response.data;
  },

  // Obtener puntos de acopio para el mapa
  getPuntosAcopio: async () => {
    const response = await api.get('/cliente/puntos-acopio');
    return response.data;
  },

  // Reclamar puntos con código QR
  reclamarPuntos: async (codigo) => {
    const response = await api.post('/transacciones/reclamar', { codigo });
    return response.data;
  },

  // Canjear puntos por artículo
  canjearPuntos: async (articuloId, puntoAcopioId) => {
    const response = await api.post('/transacciones/canjear', {
      articulo_id: articuloId,
      punto_acopio_id: puntoAcopioId
    });
    return response.data;
  }
};

// ==================== SERVICIOS GENERALES ====================

export const generalService = {
  // Obtener catálogo de artículos
  getArticulos: async () => {
    const response = await api.get('/articulos');
    return response.data;
  },

  // Solicitar ser recolector
  solicitarRecolector: async (datosAcopio) => {
    const response = await api.post('/acopios', datosAcopio);
    return response.data;
  }
};

// ==================== SERVICIOS PERFIL ====================

export const perfilService = {
  // Obtener perfil del usuario
  getPerfil: async () => {
    const response = await api.get('/perfil');
    return response.data;
  },

  // Actualizar perfil
  updatePerfil: async (datos) => {
    const response = await api.put('/perfil', datos);
    return response.data;
  },

  // Cambiar tema
  cambiarTema: async (tema) => {
    const response = await api.patch('/perfil/tema', { preferencia_tema: tema });
    return response.data;
  },

  // Cambiar contraseña
  cambiarPassword: async (passwordActual, passwordNuevo) => {
    const response = await api.patch('/perfil/password', {
      password_actual: passwordActual,
      password_nuevo: passwordNuevo,
      password_nuevo_confirmation: passwordNuevo
    });
    return response.data;
  }
};

// ==================== SERVICIOS PÚBLICOS (SIN AUTENTICACIÓN) ====================

export const publicService = {
  // Obtener TODOS los puntos de acopio (público, sin login)
  getPuntosAcopioPublico: async () => {
    const response = await publicApi.get('/public/puntos-acopio');
    return response.data;
  }
};

export default {
  cliente: clienteService,
  general: generalService,
  perfil: perfilService,
  public: publicService
};
