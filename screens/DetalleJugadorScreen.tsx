import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type DetalleJugadorScreenRouteProp = RouteProp<RootStackParamList, 'DetalleJugador'>;

interface DetalleJugadorScreenProps {
  route: DetalleJugadorScreenRouteProp;
}

interface Jugador {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  posicion: string;
  equipo: string;
  foto: string;
  estadisticas: {
    goles: number;
    asistencias: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
  };
}

export default function DetalleJugadorScreen({ route }: DetalleJugadorScreenProps) {
  const { id } = route.params;
  const [jugador, setJugador] = useState<Jugador | null>(null);

  useEffect(() => {
    // Aquí deberías cargar los detalles del jugador desde tu API o base de datos
    // Por ahora, usaremos datos de ejemplo
    setJugador({
      id,
      nombre: 'Juan',
      apellido: 'Pérez',
      edad: 25,
      posicion: 'Delantero',
      equipo: 'Equipo A',
      foto: 'https://example.com/jugador.png',
      estadisticas: {
        goles: 10,
        asistencias: 5,
        tarjetasAmarillas: 2,
        tarjetasRojas: 0,
      },
    });
  }, [id]);

  if (!jugador) {
    return <View style={styles.container}><Text>Cargando detalles del jugador...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: jugador.foto }} style={styles.foto} />
      <Text style={styles.nombre}>{`${jugador.nombre} ${jugador.apellido}`}</Text>
      <Text style={styles.info}>{`Edad: ${jugador.edad}`}</Text>
      <Text style={styles.info}>{`Posición: ${jugador.posicion}`}</Text>
      <Text style={styles.info}>{`Equipo: ${jugador.equipo}`}</Text>
      <View style={styles.estadisticas}>
        <Text style={styles.subtitulo}>Estadísticas:</Text>
        <Text style={styles.estadistica}>{`Goles: ${jugador.estadisticas.goles}`}</Text>
        <Text style={styles.estadistica}>{`Asistencias: ${jugador.estadisticas.asistencias}`}</Text>
        <Text style={styles.estadistica}>{`Tarjetas Amarillas: ${jugador.estadisticas.tarjetasAmarillas}`}</Text>
        <Text style={styles.estadistica}>{`Tarjetas Rojas: ${jugador.estadisticas.tarjetasRojas}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  foto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  estadisticas: {
    marginTop: 20,
    alignItems: 'center',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  estadistica: {
    fontSize: 16,
    marginBottom: 5,
  },
});