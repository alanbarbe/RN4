import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { obtenerDetalleEquipo } from '../services/api';
import { Equipo } from '../types';

type RootStackParamList = {
  DetalleEquipo: { id: string };
};

type DetalleEquipoScreenRouteProp = RouteProp<RootStackParamList, 'DetalleEquipo'>;

type Props = {
  route: DetalleEquipoScreenRouteProp;
};

export default function DetalleEquipoScreen({ route }: Props) {
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const { id } = route.params;

  useEffect(() => {
    cargarDetalleEquipo();
  }, []);

  const cargarDetalleEquipo = async () => {
    try {
      const datos = await obtenerDetalleEquipo(id);
      setEquipo(datos);
    } catch (error) {
      console.error('Error al cargar detalle del equipo:', error);
    }
  };

  if (!equipo) {
    return (
      <View style={styles.contenedor}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedor}>
      <Image source={{ uri: equipo.escudo }} style={styles.escudo} />
      <Text style={styles.nombre}>{equipo.nombre}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Fundación:</Text>
        <Text style={styles.infoValue}>{equipo.fundacion}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Estadio:</Text>
        <Text style={styles.infoValue}>{equipo.estadio}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Entrenador:</Text>
        <Text style={styles.infoValue}>{equipo.entrenador}</Text>
      </View>
      <Text style={styles.subtitulo}>Jugadores</Text>
      {equipo.jugadores.map((jugador: { nombre: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; posicion: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: any) => (
        <View key={`jugador-${index}`} style={styles.jugadorContainer}>
          <Text style={styles.jugadorNombre}>{jugador.nombre}</Text>
          <Text style={styles.jugadorPosicion}>{jugador.posicion}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 15,
  },
  escudo: {
    width: 150,
    height: 150,
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
  jugadorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  jugadorNombre: {
    fontSize: 16,
    color: '#34495e',
  },
  jugadorPosicion: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});