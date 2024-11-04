import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Inicio'>;

export default function InicioScreen() {
  const navigation = useNavigation<NavigationProp>();

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
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.button}
          onPress={() => navigation.navigate(item.route)}
        >
          <Text style={styles.buttonText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});