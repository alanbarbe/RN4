import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../context/authContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();

  const handleResetPassword = async () => {
    try {
      await forgotPassword(email);
      Alert.alert('Éxito', 'Se ha enviado un email para restablecer tu contraseña');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al enviar el email de recuperación');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Recuperar Contraseña" onPress={handleResetPassword} />
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.link}
      >
        <Text>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 15,
    alignItems: 'center',
  }
});

export default ForgotPasswordScreen;