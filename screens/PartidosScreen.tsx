import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import type { NavigationScreenProps, Partido } from '../types';

export default function PartidosScreen({ navigation }: NavigationScreenProps<'Partidos'>) {
  const [partidos, setPartidos] = useState<Partido[]>([]);

  const renderPartido = useCallback(({ item }: { item: Partido }) => (
    <TouchableOpacity
      style={styles.partidoCard}
      onPress={() => navigation.navigate('DetallePartido', { id: item.id })}
    >
      <Text style={styles.fecha}>
        {new Date(item.fecha).toLocaleDateString()}
      </Text>
      <View style={styles.equipos}>
        <Text style={styles.equipo}>{item.equipoLocal}</Text>
        <Text style={styles.vs}>vs</Text>
        <Text style={styles.equipo}>{item.equipoVisitante}</Text>
      </View>
      <Text style={styles.lugar}>{item.lugar}</Text>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={partidos}
        renderItem={renderPartido}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay partidos programados</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  partidoCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  fecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  equipos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipo: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  vs: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  lugar: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});