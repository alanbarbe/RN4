import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, Modal, SafeAreaView, KeyboardTypeOptions } from 'react-native';
import { useAuth } from '../../context/authContext';
import { usePlayers } from '../../hooks/usePlayers';
import { useTeams } from '../../hooks/useTeams';
import { Player, Team } from '../../types';
import { uploadImage } from '../../utils/storage';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useUsers } from '../../hooks/useUsers';
import * as ImageManipulator from 'expo-image-manipulator';
import { Picker } from '@react-native-picker/picker';

const CameraComponent = ({
    visible,
    onClose,
    onTakePhoto
}: {
    visible: boolean;
    onClose: () => void;
    onTakePhoto: (uri: string) => void;
}) => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<string | null>(null);
    const cameraRef = useRef<any>(null);

    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                const manipulations = [];

                if (facing === 'front') {
                    manipulations.push({ flip: ImageManipulator.FlipType.Horizontal });
                }

                const manipulatedPhoto = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    manipulations,
                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                );
                setPhoto(manipulatedPhoto.uri);
            } catch (error) {
                console.error('Error taking picture:', error);
            }
        }
    };

    const handleUsePhoto = () => {
        if (photo) {
            onTakePhoto(photo);
            setPhoto(null);
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                {photo ? (
                    <View style={styles.container}>
                        <Image source={{ uri: photo }} style={styles.camera} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={() => setPhoto(null)}
                            >
                                <Text style={styles.buttonText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.cameraButton, styles.usePhotoButton]}
                                onPress={handleUsePhoto}
                            >
                                <Text style={styles.buttonText}>Use Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <CameraView
                            style={styles.camera}
                            facing={facing}
                            ref={cameraRef}
                        >
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.cameraButton}
                                    onPress={() => setFacing(current =>
                                        current === 'back' ? 'front' : 'back'
                                    )}
                                >
                                    <Text style={styles.buttonText}>Flip</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cameraButton}
                                    onPress={takePicture}
                                >
                                    <Text style={styles.buttonText}>Take Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.cameraButton, styles.closeButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </CameraView>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
};

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { players, updatePlayer, fetchPlayers } = usePlayers();
    const { teams, updateTeam, fetchTeams } = useTeams();
    const [profile, setProfile] = useState<Player | Team | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<Partial<Player | Team>>({});
    const [showCamera, setShowCamera] = useState(false);
    const { users, fetchUsers } = useUsers();
    const currentUser = users.find(u => u.user_id === user?.id);

    console.log('currentUser:', currentUser);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPlayers();
        fetchUsers();
        fetchTeams();
    }, []);

    useEffect(() => {
        if (user && currentUser) {
            if (currentUser.role === 'player') {
                const currentPlayer = players.find(p => p.user_id == String(currentUser.id));
                setProfile(currentPlayer || null);
                setEditedProfile(currentPlayer || {});
            } else if (currentUser.role === 'team') {
                const currentTeam = teams.find(t => t.team_id == String(currentUser.id));
                setProfile(currentTeam || null);
                setEditedProfile(currentTeam || {});
            }
        }
    }, [user, currentUser, players, teams]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (profile) {
            try {
                if (currentUser?.role === 'player') {
                    await updatePlayer(profile.id, editedProfile as Partial<Player>);
                    await fetchPlayers();
                } else if (currentUser?.role === 'team') {
                    await updateTeam(profile.id, editedProfile as Partial<Team>);
                    await fetchTeams();
                }
                setIsEditing(false);
                Alert.alert('Éxito', 'Perfil actualizado correctamente');
            } catch (error) {
                console.error('Error updating profile:', error);
                Alert.alert('Error', 'No se pudo actualizar el perfil');
            }
        }
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            await uploadAndUpdateImage(uri);
        }
    };

    const handleCameraCapture = () => {
        setShowCamera(true);
    };

    const handlePhotoTaken = async (photoUri: string) => {
        await uploadAndUpdateImage(photoUri);
    };

    const uploadAndUpdateImage = async (uri: string) => {
        try {
            const folder = currentUser?.role === 'player' ? 'player-photos' : 'team-shields';
            const publicUrl = await uploadImage(uri, folder);
            if (publicUrl) {
                const imageField = currentUser?.role === 'player' ? 'image' : 'team_shield';
                setEditedProfile(prev => ({ ...prev, [imageField]: publicUrl }));
                if (profile) {
                    if (currentUser?.role === 'player') {
                        await updatePlayer(profile.id, { image: publicUrl });
                        await fetchPlayers();
                    } else if (currentUser?.role === 'team') {
                        await updateTeam(profile.id, { team_shield: publicUrl });
                        await fetchTeams();
                    }
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'No se pudo subir la imagen');
        }
    };

    if (!profile) {
        return (
            <View style={styles.container}>
                <Text>Cargando perfil...</Text>
            </View>
        );
    }

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


    const renderPlayerProfile = () => (
        <>
            <View style={styles.infoContainer}>
                <InfoItem
                    label="Posición"
                    value={(editedProfile as Player).position || (profile as Player).position}
                    isEditing={isEditing}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, position: text }))}
                />
                <InfoItem
                    label="Número"
                    value={(editedProfile as Player).jersey_number?.toString() || (profile as Player).jersey_number?.toString()}
                    isEditing={isEditing}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, jersey_number: parseInt(text) || 0 }))}
                    keyboardType="numeric"
                />
                <InfoItem
                    label="Edad"
                    value={(editedProfile as Player).age?.toString() || (profile as Player).age?.toString()}
                    isEditing={isEditing}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, age: parseInt(text) || 0 }))}
                    keyboardType="numeric"
                />
                {isEditing ? (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Equipo:</Text>
                        <Picker
                            selectedValue={(editedProfile as Player).team || (profile as Player).team}
                            style={styles.pickerContainer}
                            onValueChange={(itemValue) => setEditedProfile(prev => ({ ...prev, team: itemValue }))}
                        >
                            {teams.map((team) => (
                                <Picker.Item key={team.id} label={team.name} value={team.id} />
                            ))}
                        </Picker>
                    </View>
                ) : (
                    <InfoItem
                        label="Equipo"
                        value={teams.find(t => t.id === ((editedProfile as Player).team || (profile as Player).team))?.name || 'Team not found'}
                        isEditing={false}
                        onChangeText={() => { }}
                    />
                )}
            </View>
        </>
    );

    const renderTeamProfile = () => (
        <>
          <View style={styles.infoContainer}>
            <InfoItem
              label="Nombre del Equipo"
              value={editedProfile?.name !== '' ? editedProfile?.name ?? '' : profile?.name ?? ''}
              isEditing={isEditing}
              onChangeText={(text) =>
                setEditedProfile((prev) => ({
                  ...prev,
                  name: text || prev.name || (profile as Team)?.name || '',
                }))
              }
            />
          </View>
        </>
      );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{
                        uri: currentUser?.role === 'player'
                            ? (editedProfile as Player).image || (profile as Player).image
                            : (editedProfile as Team).team_shield || (profile as Team).team_shield
                            || 'https://via.placeholder.com/150'
                    }}
                    style={styles.profileImage}
                />
                <View style={styles.imageButtonContainer}>
                    <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                        <Text style={styles.imageButtonText}>Elegir foto</Text>
                    </TouchableOpacity>

                    {
                        currentUser?.role === 'player' && (
                            <TouchableOpacity style={styles.imageButton} onPress={handleCameraCapture}>
                                <Text style={styles.imageButtonText}>Tomar foto</Text>
                            </TouchableOpacity>
                        )
                    }

                </View>
                <Text style={styles.name}>
                    {currentUser?.role === 'player'
                        ? `${(profile as Player).name} ${(profile as Player).surname}`
                        : (profile as Team).name
                    }
                </Text>
            </View>

            {currentUser?.role === 'player' ? renderPlayerProfile() : renderTeamProfile()}

            {isEditing ? (
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Guardar Cambios</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={styles.buttonCloseSession}
                onPress={handleSignOut}
            >
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <CameraComponent
                visible={showCamera}
                onClose={() => setShowCamera(false)}
                onTakePhoto={handlePhotoTaken}
            />
        </ScrollView>
    );
}

const InfoItem = ({
  label,
  value,
  isEditing,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}:</Text>
    {isEditing ? (
      <TextInput
        style={styles.input}
        value={value || ''}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        keyboardType={keyboardType}
        onFocus={() => onChangeText('')}
      />
    ) : (
      <Text style={styles.value}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    imageButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    imageButton: {
        backgroundColor: '#34D399',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    imageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoContainer: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 15,
        borderRadius: 10,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    value: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        fontSize: 16,
        color: '#666',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 5,
        width: '60%',
    },
    button: {
        backgroundColor: '#34D399',
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonCloseSession: {
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
    },

    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        justifyContent: 'space-around',
    },
    cameraButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 100,
    },
    usePhotoButton: {
        backgroundColor: '#34D399',
    },
    closeButton: {
        backgroundColor: '#ff4444',
    },
    message: {
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: '#34D399',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    permissionButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
        width: '60%',
    },
});