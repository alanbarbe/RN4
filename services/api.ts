import axios from 'axios';
import { Equipo } from '../components/TarjetaEquipo';
import { Jugador, Partido, EstadisticasTorneo } from '../types';

const API_URL = 'https://tu-api-url.com/api'; // Reemplaza con la URL real de tu API

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Equipos
export const obtenerEquipos = async (): Promise<Equipo[]> => {
  try {
    const response = await api.get('/equipos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    throw error;
  }
};

export const obtenerDetalleEquipo = async (id: string): Promise<Equipo> => {
  try {
    const response = await api.get(`/equipos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle del equipo:', error);
    throw error;
  }
};

export const obtenerEquiposDestacados = async (): Promise<Equipo[]> => {
  try {
    const response = await api.get('/equipos/destacados');
    return response.data;
  } catch (error) {
    console.error('Error al obtener equipos destacados:', error);
    throw error;
  }
};

// Jugadores
export const obtenerJugadores = async (): Promise<Jugador[]> => {
  try {
    const response = await api.get('/jugadores');
    return response.data;
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    throw error;
  }
};

export const obtenerDetalleJugador = async (id: string): Promise<Jugador> => {
  try {
    const response = await api.get(`/jugadores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle del jugador:', error);
    throw error;
  }
};

// Partidos
export const obtenerPartidos = async (): Promise<Partido[]> => {
  try {
    const response = await api.get('/partidos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener partidos:', error);
    throw error;
  }
};

export const obtenerDetallePartido = async (id: string): Promise<Partido> => {
  try {
    const response = await api.get(`/partidos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle del partido:', error);
    throw error;
  }
};

export const obtenerProximosPartidos = async (): Promise<Partido[]> => {
  try {
    const response = await api.get('/partidos/proximos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener próximos partidos:', error);
    throw error;
  }
};

// Estadísticas
export const obtenerEstadisticasTorneo = async (): Promise<EstadisticasTorneo> => {
  try {
    const response = await api.get('/estadisticas/torneo');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas del torneo:', error);
    throw error;
  }
};

// Autenticación
export const iniciarSesion = async (email: string, contraseña: string) => {
  try {
    const response = await api.post('/auth/login', { email, contraseña });
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const registrarUsuario = async (datosUsuario: {
  nombre: string;
  email: string;
  contraseña: string;
  rol: 'administrador' | 'jugador' | 'seguidor';
}) => {
  try {
    const response = await api.post('/auth/registro', datosUsuario);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

export default api;