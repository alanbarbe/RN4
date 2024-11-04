import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Equipos'>;

interface Equipo {
  id: string;
  nombre: string;
  escudo: string;
}

export default function EquiposScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  useEffect(() => {
    // Aquí deberías cargar los equipos desde tu API o base de datos
    // Por ahora, usaremos datos de ejemplo
    setEquipos([
      { id: '1', nombre: 'Equipo A', escudo: 'https://example.com/escudoA.png' },
      { id: '2', nombre: 'Equipo B', escudo: 'https://example.com/escudoB.png' },
      { id: '3', nombre: 'Equipo C', escudo: 'https://example.com/escudoC.png' },
    ]);
  }, []);

  const renderEquipo = ({ item }: { item: Equipo }) => (
    <TouchableOpacity
      style={styles.equipoItem}
      onPress={() => navigation.navigate('DetalleEquipo', { id: item.id })}
    >
      <Text style={styles.equipoNombre}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={equipos}
        renderItem={renderEquipo}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay equipos disponibles</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  equipoItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  equipoNombre: {
    fontSize: 18,
  },
});