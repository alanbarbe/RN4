import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import  App  from '../components/CamaraComponent';

export default function PerfilScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const handleFotoTomada = (uri: React.SetStateAction<null>) => {
    setFotoPerfil(uri);
    setMostrarCamara(false);
    // Aquí podrías implementar la lógica para subir la foto al servidor
  };

  if (mostrarCamara) {
    return <App onPhotoTaken={handleFotoTomada} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setMostrarCamara(true)}>
        <Image
          source={fotoPerfil ? { uri: fotoPerfil } : require('../../assets/default-profile.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <Text style={styles.name}>{usuario?.nombre}</Text>
      <Text style={styles.email}>{usuario?.email}</Text>
      <Text style={styles.role}>{usuario?.rol}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6fa',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  email: {
    fontSize: 18,
    marginBottom: 10,
    color: '#34495e',
  },
  role: {
    fontSize: 16,
    marginBottom: 20,
    color: '#7f8c8d',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});