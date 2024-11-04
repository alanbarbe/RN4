import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useCamera = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const requestCameraPermissions = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      const hasPermission = await requestCameraPermissions();
      
      if (!hasPermission) {
        throw new Error('No hay permisos de cámara');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      return null;
    }
  }, []);

  return {
    photo,
    takePhoto,
    requestCameraPermissions,
  };
};