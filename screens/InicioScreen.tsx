import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationScreenProps } from '../types';

export default function InicioScreen({ navigation }: NavigationScreenProps<'Inicio'>) {
  const menuItems = [
    { title: 'Equipos', route: 'Equipos' },
    { title: 'Jugadores', route: 'Jugadores' },
    { title: 'Partidos', route: 'Partidos' },
    { title: 'Estadísticas', route: 'Estadisticas' },
    { title: 'Perfil', route: 'Perfil' },
  ] as const;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Torneo de Fútbol</Text>
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  menuContainer: {
    gap: 15,
  },
  menuItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});