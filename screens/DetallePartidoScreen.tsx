import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { obtenerDetallePartido } from '../services/api';
import MapaPartido from '../components/MapaPartido';
import { Partido } from '../types';

type RootStackParamList = {
  DetallePartido: { id: string };
};

type DetallePartidoScreenRouteProp = RouteProp<RootStackParamList, 'DetallePartido'>;

type Props = {
  route: DetallePartidoScreenRouteProp;
};

export default function DetallePartidoScreen({ route }: Props) {
  const [partido, setPartido] = useState<Partido | null>(null);
  const { id } = route.params;

  useEffect(() => {
    cargarDetallePartido();
  }, []);

  const cargarDetallePartido = async () => {
    try {
      const datos = await obtenerDetallePartido(id);
      setPartido(datos);
    } catch (error) {
      console.error('Error al cargar detalle del partido:', error);
    }
  };

  if (!partido) {
    return (
      <View style={styles.contenedor}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedor}>
      <View style={styles.equiposContainer}>
        <Text style={styles.equipoNombre}>{partido.equipoLocal}</Text>
        <Text style={styles.vs}>VS</Text>
        <Text style={styles.equipoNombre}>{partido.equipoVisitante}</Text>
      </View>
      <Text style={styles.fecha}>{partido.fecha}</Text>
      <Text style={styles.estadio}>{partido.estadio}</Text>
      {partido.resultado && (
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultado}>{partido.resultado.golesLocal}</Text>
          <Text style={styles.resultado}>-</Text>
          <Text style={styles.resultado}>{partido.resultado.golesVisitante}</Text>
        </View>
      )}
      <Text style={styles.subtitulo}>Eventos del Partido</Text>
      {partido.eventos.map((evento, index) => (
        <View key={index} style={styles.eventoContainer}>
          <Text style={styles.eventoMinuto}>{evento.minuto}'</Text>
          <Text style={styles.eventoDescripcion}>{evento.descripcion}</Text>
        </View>
      ))}
      <Text style={styles.subtitulo}>Ubicación del Estadio</Text>
      <MapaPartido 
        latitud={partido.ubicacion.latitud} 
        longitud={partido.ubicacion.longitud} 
        titulo={partido.estadio} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 15,
  },
  equiposContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  equipoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  vs: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  fecha: {
    fontSize: 18,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 10,
  },
  estadio: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultadoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultado: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginHorizontal: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c3e50',
  },
  eventoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  eventoMinuto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginRight: 10,
  },
  eventoDescripcion: {
    fontSize: 16,
    color: '#34495e',
  },
});