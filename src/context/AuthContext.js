import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar si hay token
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      console.log('AuthContext - useEffect ejecutándose, token:', savedToken ? 'presente' : 'ausente');
      
      if (savedToken) {
        try {
          console.log('AuthContext - Cargando usuario desde /user');
          const response = await api.get('/user');
          console.log('AuthContext - Usuario cargado:', response.data);
          setUser(response.data);
          setToken(savedToken);
        } catch (error) {
          console.error('AuthContext - Error al cargar usuario:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext - Iniciando login...');
      const response = await api.post('/login', { email, password });
      
      console.log('AuthContext - Respuesta completa del backend:', response.data);
      
      // El backend devuelve 'access_token' no 'token'
      const { access_token: newToken, user: userData } = response.data;
      
      console.log('AuthContext - Token recibido:', newToken);
      console.log('AuthContext - Usuario recibido:', userData);
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      console.log('AuthContext - Estado actualizado en memoria');
      console.log('AuthContext - Token en localStorage:', localStorage.getItem('token'));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('AuthContext - Error en login:', error);
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      
      console.log('AuthContext - Respuesta registro:', response.data);
      
      // El backend devuelve 'access_token' no 'token'
      const { access_token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrarse';
      const errors = error.response?.data?.errors || {};
      return { success: false, message, errors };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedData }));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isCliente: user?.rol === 'cliente',
    isRecolector: user?.rol === 'recolector',
    isAdmin: user?.rol === 'admin',
    login,
    register,
    logout,
    updateUser
  };

  // Solo logear cuando hay cambios significativos
  useEffect(() => {
    if (!loading) {
      console.log('AuthContext - Estado final:', {
        hasUser: !!user,
        hasToken: !!token,
        isAuthenticated: !!token && !!user,
        userRol: user?.rol,
        userName: user?.nombre
      });
    }
  }, [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
