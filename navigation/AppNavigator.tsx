import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../types';
import InicioScreen from '../screens/InicioScreen';
import EquiposScreen from '../screens/EquiposScreen';
import JugadoresScreen from '../screens/JugadoresScreen';
import PartidosScreen from '../screens/PartidosScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import DetalleEquipoScreen from '../screens/DetalleEquipoScreen';
import DetalleJugadorScreen from '../screens/DetalleJugadorScreen';
import DetallePartidoScreen from '../screens/DetallePartidoScreen';
import { NavigationContainer } from '@react-navigation/native';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="DetalleEquipo" component={DetalleEquipoScreen} />
        <Stack.Screen name="DetalleJugador" component={DetalleJugadorScreen} />
        <Stack.Screen name="DetallePartido" component={DetallePartidoScreen} />
        <Stack.Screen name="Equipos" component={EquiposScreen} />
        <Stack.Screen name="Jugadores" component={JugadoresScreen} />
        <Stack.Screen name="Partidos" component={PartidosScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Estadisticas" component={EstadisticasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}