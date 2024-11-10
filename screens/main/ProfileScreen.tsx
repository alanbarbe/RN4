import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/authContext';

const ProfileScreen = () => {
    const { signOut, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      console.log('Cierre de sesión exitoso en ProfileScreen');
    } catch (error) {
      console.error('Error al cerrar sesión en ProfileScreen:', error);
      Alert.alert(
        'Error',
        'No se pudo cerrar la sesión. Por favor, intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Perfil de Usuario</Text>
      <Text style={styles.cardText}>Email: {user?.email}</Text>
    </View>

    <TouchableOpacity 
      style={[styles.button, isLoading && styles.buttonDisabled]} 
      onPress={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      )}
    </TouchableOpacity>
  </View>
  );
};

// Estilos compartidos para todas las pantallas
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default ProfileScreen;