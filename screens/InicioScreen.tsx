import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { obtenerProximosPartidos, obtenerEquiposDestacados, obtenerEstadisticasTorneo } from '../services/api';
import { Partido, Equipo, EstadisticasTorneo } from '../types';


export default function InicioScreen() {
  const navigation = useNavigation();
  const [proximosPartidos, setProximosPartidos] = useState<Partido[]>([]);
  const [equiposDestacados, setEquiposDestacados] = useState<Equipo[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasTorneo | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [partidos, equipos, stats] = await Promise.all([
        obtenerProximosPartidos(),
        obtenerEquiposDestacados(),
        obtenerEstadisticasTorneo()
      ]);
      setProximosPartidos(partidos);
      setEquiposDestacados(equipos);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar datos de inicio:', error);
    }
  };

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.titulo}>Torneo de Fútbol</Text>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Próximos Partidos</Text>
        {proximosPartidos.map((partido) => (
          <TouchableOpacity 
            key={partido.id} 
            style={styles.tarjetaPartido}
            onPress={() => navigation.navigate('DetallePartido', { id: partido.id })}
          >
            <Text style={styles.textoPartido}>{partido.equipoLocal} vs {partido.equipoVisitante}</Text>
            <Text style={styles.textoFecha}>{partido.fecha}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Equipos Destacados</Text>
        {equiposDestacados.map((equipo) => (
          <TouchableOpacity 
            key={equipo.id} 
            style={styles.tarjetaEquipo}
            onPress={() => navigation.navigate('DetalleEquipo', { id: equipo.id })}
          >
            <Image source={{ uri: equipo.escudo }} style={styles.escudoEquipo} />
            <View style={styles.infoEquipo}>
              <Text style={styles.nombreEquipo}>{equipo.nombre}</Text>
              <Text style={styles.posicionEquipo}>Posición: {equipo.posicion || 'N/A'}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {estadisticas && (
        <View style={styles.seccion}>
          <Text style={styles.subtitulo}>Estadísticas del Torneo</Text>
          <View style={styles.tarjetaEstadisticas}>
            <Text style={styles.textoEstadistica}>Goles totales: {estadisticas.goles.total}</Text>
            <Text style={styles.textoEstadistica}>Partidos jugados: {estadisticas.partidos.jugados}</Text>
            <Text style={styles.textoEstadistica}>Tarjetas amarillas: {estadisticas.tarjetas.amarillas}</Text>
            <Text style={styles.textoEstadistica}>Tarjetas rojas: {estadisticas.tarjetas.rojas}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 15,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  seccion: {
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 10,
  },
  tarjetaPartido: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textoPartido: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  textoFecha: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  tarjetaEquipo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  escudoEquipo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  infoEquipo: {
    flex: 1,
  },
  nombreEquipo: {
    fontSize: 16,
    
    fontWeight: '600',
    color: '#2c3e50',
  },
  posicionEquipo: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  tarjetaEstadisticas: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textoEstadistica: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
});