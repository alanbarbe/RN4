import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import type { Jugador } from '../types';

interface JugadorState {
  id: string;
  nombre: string;
  escudo: string;
  posicion: string;
  estadisticas: {
    goles: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
    partidosJugados: number;
  };
}

const JugadoresScreen: React.FC = () => {
  
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<JugadorState>({
    id: '',
    nombre: '',
    escudo: '',
    posicion: '',
    estadisticas: {
      goles: 0,
      tarjetasAmarillas: 0,
      tarjetasRojas: 0,
      partidosJugados: 0
    }
  });

  
  const actualizarJugador = (jugador: Jugador) => {
    setJugadorSeleccionado({
      id: jugador.id,
      nombre: jugador.nombre,
      escudo: '', 
      posicion: jugador.posicion,
      estadisticas: jugador.estadisticas
    });
  };

  return (
    <View>
      <FlatList
        data={jugadores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nombre}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default JugadoresScreen;