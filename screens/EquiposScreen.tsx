import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TarjetaEquipo from '../components/TarjetaEquipo';
import { obtenerEquipos } from '../services/api';
import type { Equipo } from '../types';

export default function EquiposScreen() {
  const [equipos, setEquipos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const datosEquipos = await obtenerEquipos();
      setEquipos(datosEquipos);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    }
  };

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={equipos}
        renderItem={({ item }) => (
          <TarjetaEquipo
            equipo={item}
            onPress={() => navigation.navigate('DetalleEquipo', { id: item.id })}
          />
        )}
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
});