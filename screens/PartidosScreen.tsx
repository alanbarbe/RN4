import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { obtenerPartidos } from '../services/api';

export default function PartidosScreen() {
  const [partidos, setPartidos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    cargarPartidos();
  }, []);

  const cargarPartidos = async () => {
    try {
      const datosPartidos = await obtenerPartidos();
      setPartidos(datosPartidos);
    } catch (error) {
      console.error('Error al cargar partidos:', error);
    }
  };

  const renderPartido = ({ item }) => (
    <TouchableOpacity 
      style={styles.tarjetaPartido}
      onPress={() => navigation.navigate('DetallePartido', { id: item.id })}
    >
      <Text style={styles.fechaPartido}>{item.fecha}</Text>
      <View style={styles.equiposContainer}>
        <Text style={styles.equipoNombre}>{item.equipoLocal}</Text>
        <Text style={styles.vs}>VS</Text>
        <Text style={styles.equipoNombre}>{item.equipoVisitante}</Text>
      </View>
      <Text style={styles.estadioPartido}>{item.estadio}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={partidos}
        renderItem={renderPartido}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 15,
  },
  tarjetaPartido: {
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
  fechaPartido: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  equiposContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  equipoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  vs: {
    fontSize: 14,
    color: '#3498db',
  },
  estadioPartido: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
});