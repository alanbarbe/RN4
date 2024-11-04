import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import InicioScreen from '../screens/InicioScreen';
import EquiposScreen from '../screens/EquiposScreen';
import JugadoresScreen from '../screens/JugadoresScreen';
import PartidosScreen from '../screens/PartidosScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import DetalleEquipoScreen from '../screens/DetalleEquipoScreen';
import DetalleJugadorScreen from '../screens/DetalleJugadorScreen';
import DetallePartidoScreen from '../screens/DetallePartidoScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Equipos') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Jugadores') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Partidos') {
            iconName = focused ? 'football' : 'football-outline';
          } else if (route.name === 'Estadísticas') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Equipos" component={EquiposScreen} />
      <Tab.Screen name="Jugadores" component={JugadoresScreen} />
      <Tab.Screen name="Partidos" component={PartidosScreen} />
      <Tab.Screen name="Estadísticas" component={EstadisticasScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="DetalleEquipo" component={DetalleEquipoScreen} />
      <Stack.Screen name="DetalleJugador" component={DetalleJugadorScreen} />
      <Stack.Screen name="DetallePartido" component={DetallePartidoScreen} />
    </Stack.Navigator>
  );
}