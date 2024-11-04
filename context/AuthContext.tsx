import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import axios from 'axios';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: 'administrador' | 'jugador' | 'seguidor';
}

interface ContextoAuth {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (email: string, contraseña: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  registrar: (email: string, contraseña: string, nombre: string, rol: Usuario['rol']) => Promise<void>;
}

const AuthContext = createContext<ContextoAuth | undefined>(undefined);

const API_URL = 'https://tu-api-url.com/api'; // Reemplaza con la URL de tu API

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem('usuario');
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesion = async (email: string, contraseña: string) => {
    try {
      const respuesta = await axios.post(`${API_URL}/auth/login`, { email, contraseña });
      const usuarioLogueado = respuesta.data.usuario;
      await AsyncStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
      setUsuario(usuarioLogueado);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem('usuario');
      setUsuario(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  const registrar = async (email: string, contraseña: string, nombre: string, rol: Usuario['rol']) => {
    try {
      const respuesta = await axios.post(`${API_URL}/auth/register`, { email, contraseña, nombre, rol });
      const nuevoUsuario = respuesta.data.usuario;
      await AsyncStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      setUsuario(nuevoUsuario);
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', 'No se pudo completar el registro. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion, registrar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};