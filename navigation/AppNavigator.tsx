import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import InicioScreen from '../screens/InicioScreen';
import EquiposScreen from '../screens/EquiposScreen';
import JugadoresScreen from '../screens/JugadoresScreen';
import PartidosScreen from '../screens/PartidosScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import DetalleEquipoScreen from '../screens/DetalleEquipoScreen';
import DetalleJugadorScreen from '../screens/DetalleJugadorScreen';
import DetallePartidoScreen from '../screens/DetallePartidoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Inicio">
      <Stack.Screen name="Inicio" component={InicioScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Equipos" component={EquiposScreen} options={{ title: 'Equipos' }} />
      <Stack.Screen name="Jugadores" component={JugadoresScreen} options={{ title: 'Jugadores' }} />
      <Stack.Screen name="Partidos" component={PartidosScreen} options={{ title: 'Partidos' }} />
      <Stack.Screen name="Estadisticas" component={EstadisticasScreen} options={{ title: 'Estadísticas' }} />
      <Stack.Screen name="DetalleEquipo" component={DetalleEquipoScreen} options={{ title: 'Detalle del Equipo' }} />
      <Stack.Screen name="DetalleJugador" component={DetalleJugadorScreen} options={{ title: 'Detalle del Jugador' }} />
      <Stack.Screen name="DetallePartido" component={DetallePartidoScreen} options={{ title: 'Detalle del Partido' }} />
      <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}