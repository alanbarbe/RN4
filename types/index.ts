import { LocationObject } from "expo-location";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ReactNode } from "react";


export type RootStackParamList = {
  Inicio: undefined;
  DetalleEquipo: { id: string };
  DetalleJugador: { id: string };
  DetallePartido: { id: string };
  Equipos: undefined;
  Jugadores: undefined;
  Partidos: undefined;
  Perfil: undefined;
  Estadisticas: undefined;
};

export type NavigationScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

  export interface PhotoTakenEvent {
    uri: string;
  }
export interface Equipo {
  id: string;
  nombre: string;
  escudo: string;
  jugadores: number;
  victorias: number;
  derrotas: number;
  empates: number;
  fundacion: string;
  estadio: string;
  entrenador: string;
  posicion?: number;
}

export interface Jugador {
  id: string;
  nombre: string;
  foto: string;
  edad: number;
  posicion: string;
  numero: number;
  equipo: string;
  nacionalidad: string;
  estadisticas: {
    goles: number;
    asistencias: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
  };
}

export interface Partido {
  lugar: ReactNode;
  id: string;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  estadio: string;
  resultado?: {
    golesLocal: number;
    golesVisitante: number;
  };
  eventos: Array<{
    minuto: number;
    descripcion: string;
    tipo: 'gol' | 'tarjetaAmarilla' | 'tarjetaRoja' | 'sustitucion';
  }>;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
}

export interface EstadisticasTorneo {
  goles: {
    total: number;
    promedioPorPartido: number;
  };
  tarjetas: {
    amarillas: number;
    rojas: number;
  };
  partidos: {
    jugados: number;
    porJugar: number;
  };
  equipos: {
    total: number;
  };
  jugadores: {
    total: number;
    goleador: string;
  };
}
export interface LocationHookResult {
  location: LocationObject | null;
  errorMsg: string | null;
  requestLocation: () => Promise<void>;
}

export { LocationObject };export interface Usuario {
    }

export interface DetalleEquipoScreenProps {
  route: RootStackScreenProps<'DetalleEquipo'>['route'];
}

export interface DetalleJugadorScreenProps {
  route: RootStackScreenProps<'DetalleJugador'>['route'];
}

export interface DetallePartidoScreenProps {
  route: RootStackScreenProps<'DetallePartido'>['route'];
}