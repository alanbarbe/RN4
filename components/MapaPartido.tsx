import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface PropsMapa {
  latitud: number;
  longitud: number;
  titulo: string;
}

export default function MapaPartido({ latitud, longitud, titulo }: PropsMapa) {
  return (
    <MapView
      style={styles.mapa}
      initialRegion={{
        latitude: latitud,
        longitude: longitud,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{ latitude: latitud, longitude: longitud }}
        title={titulo}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapa: {
    width: Dimensions.get('window').width,
    height: 200,
  },
});