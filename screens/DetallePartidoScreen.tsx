import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type DetallePartidoScreenRouteProp = RouteProp<RootStackParamList, 'DetallePartido'>;

interface DetallePartidoScreenProps {
  route: DetallePartidoScreenRouteProp;
}

interface Partido {
  id: string;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  hora: string;
  lugar: string;
  resultado?: {
    golesLocal: number;
    golesVisitante: number;
  };
  eventos: Array<{
    minuto: number;
    descripcion: string;
  }>;
}

export default function DetallePartidoScreen({ route }: DetallePartidoScreenProps) {
  const { id } = route.params;
  const [partido, setPartido] = useState<Partido | null>(null);

  useEffect(() => {
    // Aquí deberías cargar los detalles del partido desde tu API o base de datos
    // Por ahora, usaremos datos de ejemplo
    setPartido({
      id,
      equipoLocal: 'Equipo A',
      equipoVisitante: 'Equipo B',
      fecha: '2023-12-01',
      hora: '20:00',
      lugar: 'Estadio Principal',
      resultado: {
        golesLocal: 2,
        golesVisitante: 1,
      },
      eventos: [
        { minuto: 15, descripcion: 'Gol de Equipo A' },
        { minuto: 35, descripcion: 'Tarjeta amarilla para jugador de Equipo B' },
        { minuto: 60, descripcion: 'Gol de Equipo B' },
        { minuto: 85, descripcion: 'Gol de Equipo A' },
      ],
    });
  }, [id]);

  if (!partido) {
    return <View style={styles.container}><Text>Cargando detalles del partido...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{`${partido.equipoLocal} vs ${partido.equipoVisitante}`}</Text>
      <Text style={styles.info}>{`Fecha: ${partido.fecha}`}</Text>
      <Text style={styles.info}>{`Hora: ${partido.hora}`}</Text>
      <Text style={styles.info}>{`Lugar: ${partido.lugar}`}</Text>
      {partido.resultado && (
        <View style={styles.resultado}>
          <Text style={styles.subtitulo}>Resultado:</Text>
          <Text style={styles.resultadoTexto}>
            {`${partido.equipoLocal} ${partido.resultado.golesLocal} - ${partido.resultado.golesVisitante} ${partido.equipoVisitante}`}
          </Text>
        </View>
      )}
      <Text style={styles.subtitulo}>Eventos del Partido:</Text>
      {partido.eventos.map((evento, index) => (
        <Text key={index} style={styles.evento}>
          {`${evento.minuto}' - ${evento.descripcion}`}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  resultado: {
    marginTop: 20,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultadoTexto: {
    fontSize: 20,
    textAlign: 'center',
    color: '#007AFF',
  },
  evento: {
    fontSize: 14,
    marginBottom: 5,
  },
});