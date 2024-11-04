import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { obtenerEstadisticasTorneo } from '../services/api';
import { EstadisticasTorneo } from '../types';

export default function EstadisticasScreen() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasTorneo | null>(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const datosEstadisticas = await obtenerEstadisticasTorneo();
      setEstadisticas(datosEstadisticas);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  if (!estadisticas) {
    return (
      <View style={styles.contenedor}>
        <Text>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedor}>
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Goles</Text>
        <Text style={styles.estadistica}>Total: {estadisticas.goles.total}</Text>
        <Text style={styles.estadistica}>Promedio por partido: {estadisticas.goles.promedioPorPartido}</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Tarjetas</Text>
        <Text style={styles.estadistica}>Amarillas: {estadisticas.tarjetas.amarillas}</Text>
        <Text style={styles.estadistica}>Rojas: {estadisticas.tarjetas.rojas}</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Partidos</Text>
        <Text style={styles.estadistica}>Jugados: {estadisticas.partidos.jugados}</Text>
        <Text style={styles.estadistica}>Por jugar: {estadisticas.partidos.porJugar}</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Equipos</Text>
        <Text style={styles.estadistica}>Participantes: {estadisticas.equipos.total}</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Jugadores</Text>
        <Text style={styles.estadistica}>Total: {estadisticas.jugadores.total}</Text>
        <Text style={styles.estadistica}>Goleador: {estadisticas.jugadores.goleador}</Text>
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
  seccion: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  estadistica: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
});