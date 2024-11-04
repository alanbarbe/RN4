import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface Estadisticas {
  equipoLider: string;
  goleador: string;
  asistidor: string;
  equipoMasGoles: string;
  equipoMenosGoles: string;
}

export default function EstadisticasScreen() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);

  useEffect(() => {
    // Aquí deberías cargar las estadísticas desde tu API o base de datos
    // Por ahora, usaremos datos de ejemplo
    setEstadisticas({
      equipoLider: 'Equipo A',
      goleador: 'Juan Pérez (Equipo A)',
      asistidor: 'María González (Equipo B)',
      equipoMasGoles: 'Equipo C',
      equipoMenosGoles: 'Equipo D',
    });
  }, []);

  if (!estadisticas) {
    return <View style={styles.container}><Text>Cargando estadísticas...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.estadisticaItem}>
        <Text  style={styles.estadisticaLabel}>Equipo Líder:</Text>
        <Text style={styles.estadisticaValor}>{estadisticas.equipoLider}</Text>
      </View>
      <View style={styles.estadisticaItem}>
        <Text style={styles.estadisticaLabel}>Goleador:</Text>
        <Text style={styles.estadisticaValor}>{estadisticas.goleador}</Text>
      </View>
      <View style={styles.estadisticaItem}>
        <Text style={styles.estadisticaLabel}>Máximo Asistidor:</Text>
        <Text style={styles.estadisticaValor}>{estadisticas.asistidor}</Text>
      </View>
      <View style={styles.estadisticaItem}>
        <Text style={styles.estadisticaLabel}>Equipo con más goles:</Text>
        <Text style={styles.estadisticaValor}>{estadisticas.equipoMasGoles}</Text>
      </View>
      <View style={styles.estadisticaItem}>
        <Text style={styles.estadisticaLabel}>Equipo con menos goles:</Text>
        <Text style={styles.estadisticaValor}>{estadisticas.equipoMenosGoles}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  estadisticaItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  estadisticaLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  estadisticaValor: {
    fontSize: 18,
    color: '#0404e2',
  },
});