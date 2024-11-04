import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { obtenerDetalleJugador } from '../services/api';
import { Jugador } from '../types';

type RootStackParamList = {
  DetalleJugador: { id: string };
};

type DetalleJugadorScreenRouteProp = RouteProp<RootStackParamList, 'DetalleJugador'>;

type Props = {
  route: DetalleJugadorScreenRouteProp;
};

export default function DetalleJugadorScreen({ route }: Props) {
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const { id } = route.params;

  useEffect(() => {
    cargarDetalleJugador();
  }, []);

  const cargarDetalleJugador = async () => {
    try {
      const datos = await obtenerDetalleJugador(id);
      setJugador(datos);
    } catch (error) {
      console.error('Error al cargar detalle del jugador:', error);
    }
  };

  if (!jugador) {
    return (
      <View style={styles.contenedor}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedor}>
      <Image source={{ uri: jugador.foto }} style={styles.foto} />
      <Text style={styles.nombre}>{jugador.nombre}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Equipo:</Text>
        <Text style={styles.infoValue}>{jugador.equipo}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Posición:</Text>
        <Text style={styles.infoValue}>{jugador.posicion}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Edad:</Text>
        <Text style={styles.infoValue}>{jugador.edad} años</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Nacionalidad:</Text>
        <Text style={styles.infoValue}>{jugador.nacionalidad}</Text>
      </View>
      <Text style={styles.subtitulo}>Estadísticas</Text>
      <View style={styles.estadisticasContainer}>
        <View style={styles.estadistica}>
          <Text style={styles.estadisticaValor}>{jugador.estadisticas.goles}</Text>
          <Text style={styles.estadisticaLabel}>Goles</Text>
        </View>
        <View style={styles.estadistica}>
          <Text style={styles.estadisticaValor}>{jugador.estadisticas.asistencias}</Text>
          <Text style={styles.estadisticaLabel}>Asistencias</Text>
        </View>
        <View style={styles.estadistica}>
          <Text style={styles.estadisticaValor}>{jugador.estadisticas.tarjetasAmarillas}</Text>
          <Text style={styles.estadisticaLabel}>T. Amarillas</Text>
        </View>
        <View style={styles.estadistica}>
          <Text style={styles.estadisticaValor}>{jugador.estadisticas.tarjetasRojas}</Text>
          <Text style={styles.estadisticaLabel}>T. Rojas</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 15,
  },
  foto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 100,
    color: '#34495e',
  },
  infoValue: {
    flex: 1,
    color: '#7f8c8d',
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c3e50',
  },
  estadisticasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  estadistica: {
    alignItems: 'center',
  },
  estadisticaValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  estadisticaLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});