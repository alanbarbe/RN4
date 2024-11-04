import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Jugadores'>;

interface Jugador {
  id: string;
  nombre: string;
  apellido: string;
  equipo: string;
}

export default function JugadoresScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [jugadores, setJugadores] = useState<Jugador[]>([]);

  useEffect(() => {
    // Aquí deberías cargar los jugadores desde tu API o base de datos
    // Por ahora, usaremos datos de ejemplo
    setJugadores([
      { id: '1', nombre: 'Juan', apellido: 'Pérez', equipo: 'Equipo A' },
      { id: '2', nombre: 'María', apellido: 'González', equipo: 'Equipo B' },
      { id: '3', nombre: 'Carlos', apellido: 'Rodríguez', equipo: 'Equipo C' },
    ]);
  }, []);

  const renderJugador = ({ item }: { item: Jugador }) => (
    <TouchableOpacity
      style={styles.jugadorItem}
      onPress={() => navigation.navigate('DetalleJugador', { id: item.id })}
    >
      <Text style={styles.jugadorNombre}>{`${item.nombre} ${item.apellido}`}</Text>
      <Text style={styles.jugadorEquipo}>{item.equipo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jugadores}
        renderItem={renderJugador}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay jugadores disponibles</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  jugadorItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  jugadorNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jugadorEquipo: {
    fontSize: 14,
    color: '#666',
  },
});