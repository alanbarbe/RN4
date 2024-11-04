import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import type { LocationObject } from '../types/index';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const requestLocationPermissions = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermissions();
      
      if (!hasPermission) {
        throw new Error('No hay permisos de ubicación');
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      return null;
    }
  }, []);

  return {
    location,
    getCurrentLocation,
    requestLocationPermissions,
  };
};