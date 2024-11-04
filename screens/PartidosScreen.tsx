import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Partidos'>;

interface Partido {
  id: string;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  resultado?: string;
}

export default function PartidosScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [partidos, setPartidos] = useState<Partido[]>([]);

  useEffect(() => {
    // Aquí deberías cargar los partidos desde tu API o base de datos
    // Por ahora, usaremos datos de ejemplo
    setPartidos([
      { id: '1', equipoLocal: 'Equipo A', equipoVisitante: 'Equipo B', fecha: '2023-12-01', resultado: '2-1' },
      { id: '2', equipoLocal: 'Equipo C', equipoVisitante: 'Equipo D', fecha: '2023-12-05' },
      { id: '3', equipoLocal: 'Equipo B', equipoVisitante: 'Equipo C', fecha: '2023-12-10' },
    ]);
  }, []);

  const renderPartido = ({ item }: { item: Partido }) => (
    <TouchableOpacity
      style={styles.partidoItem}
      onPress={() => navigation.navigate('DetallePartido', { id: item.id })}
    >
      <Text style={styles.partidoEquipos}>{`${item.equipoLocal} vs ${item.equipoVisitante}`}</Text>
      <Text style={styles.partidoFecha}>{item.fecha}</Text>
      {item.resultado && <Text style={styles.partidoResultado}>Resultado: {item.resultado}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={partidos}
        renderItem={renderPartido}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay partidos programados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  partidoItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  partidoEquipos: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  partidoFecha: {
    fontSize: 14,
    color: '#666',
  },
  partidoResultado: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
});