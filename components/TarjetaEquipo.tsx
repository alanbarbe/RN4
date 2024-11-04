import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';

interface Equipo {
  id: string;
  nombre: string;
  escudo: string;
  jugadores: number;
  victorias: number;
  derrotas: number;
  empates: number;
  posicion?: number;
  estadio?: string;
  fundacion?: string;
  entrenador?: string;
}

interface PropsTarjetaEquipo {
  equipo: Equipo;
  onPress: (id: string) => void;
}

export default function TarjetaEquipo({ equipo, onPress }: PropsTarjetaEquipo) {
  return (
    <TouchableOpacity 
      style={styles.tarjeta} 
      onPress={() => onPress(equipo.id)}
      testID={`equipo-${equipo.id}`}
    >
      <View style={styles.contenidoTarjeta}>
        <Image 
          source={{ uri: equipo.escudo }} 
          style={styles.escudo}
          resizeMode="contain"
        />
        <View style={styles.info}>
          <Text style={styles.nombre}>{equipo.nombre}</Text>
          <View style={styles.estadisticas}>
            <Text style={styles.estadistica}>
              Jugadores: {equipo.jugadores}
            </Text>
            <Text style={styles.estadistica}>
              V: {equipo.victorias} | D: {equipo.derrotas} | E: {equipo.empates}
            </Text>
          </View>
          {equipo.posicion && (
            <Text style={styles.posicion}>
              Posición actual: {equipo.posicion}º
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contenidoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  escudo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  estadisticas: {
    marginTop: 5,
  },
  estadistica: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  posicion: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 5,
    fontWeight: '600',
  },
});


export type { Equipo };