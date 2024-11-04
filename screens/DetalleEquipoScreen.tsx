import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Equipo } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleEquipo'>;

export default function DetalleEquipoScreen({ route, navigation }: Props) {
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEquipo = async () => {
      try {
        // Simular carga de datos
        const equipoData: Equipo = {
          id: route.params.id,
          nombre: 'Equipo Example',
          escudo: '/placeholder.svg',
          jugadores: 11,
          victorias: 0,
          derrotas: 0,
          empates: 0,
          fundacion: '',
          estadio: '',
          entrenador: ''
        };
        setEquipo(equipoData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarEquipo();
  }, [route.params.id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!equipo) {
    return (
      <View style={styles.container}>
        <Text>No se encontró el equipo</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{equipo.nombre}</Text>
      {/* Resto del contenido */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});