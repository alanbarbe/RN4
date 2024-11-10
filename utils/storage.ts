import { supabase } from '../lib/createClient';
import { Platform } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export const uploadImage = async (uri: string, bucket: string): Promise<string | null> => {
  try {
    console.log('Starting image upload process...');
    
    // 1. Procesar la imagen primero
    const processedImage = await manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: SaveFormat.JPEG }
    );

    // 2. Obtener la ruta del archivo procesado
    const fileUri = processedImage.uri;
    
    // 3. Leer el archivo como base64
    const base64File = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 4. Generar nombre único para el archivo
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    // 5. Subir directamente el archivo base64 a Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, decode(base64File), {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // 6. Obtener la URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    console.log('Upload successful, public URL:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Detailed upload error:', error);
    throw error;
  }
};

// Función auxiliar para decodificar base64 a Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
