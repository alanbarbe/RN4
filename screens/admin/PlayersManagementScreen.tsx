import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ActivityIndicator, 
    Platform,
    Modal,
    SafeAreaView,
    Alert
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { usePlayers } from '../../hooks/usePlayers';
import { Player } from '../../types';
import { uploadImage } from '../../utils/storage';
import PlayerStatisticsModal from '../../components/PlayerStatisticsModal';
import { useStatistics } from '../../hooks/useStatistics';
import PlayerEditModal from '../../components/PlayerEditModal';
import * as ImageManipulator from 'expo-image-manipulator';

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
                
                // If using front camera, flip the image horizontally
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

const PlayersManagementScreen = () => {
    const { players, loading, createPlayer, deletePlayer, updatePlayer, fetchPlayers } = usePlayers();
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

    const [showStatistics, setShowStatistics] = useState(false);
    const [showEditPlayer, setShowEditPlayer] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const { statistics } = useStatistics();

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleCapturePlayerImage = (playerId: number) => {
        setSelectedPlayerId(playerId);
        setShowCamera(true);
    };

    const handlePhotoTaken = async (photoUri: string) => {
        if (selectedPlayerId) {
            try {
                setUploadingImage(selectedPlayerId.toString());
                
                // Preprocesar la URI de la imagen
                const publicUrl = await uploadImage(photoUri, 'player-photos');
                
                if (publicUrl) {
                    await updatePlayer(selectedPlayerId, { image: publicUrl });
                    await fetchPlayers();
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Error uploading the image');
            } finally {
                setUploadingImage(null);
                setSelectedPlayerId(null);
            }
        }
    };

    const handleEditStatistics = (player: Player) => {
        setSelectedPlayer(player);
        setShowStatistics(true);
    };

    const handleEditPlayer = (player: Player) => {
        setSelectedPlayer(player);
        setShowEditPlayer(true);
    };

    const handleDeletePlayer = (playerId: number) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro que deseas eliminar este jugador?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => deletePlayer(playerId)
                }
            ]
        );
    };

    const renderPlayerIcon = (player: Player) => {
        if (uploadingImage === player.id.toString()) {
            return (
                <View style={styles.playerIcon}>
                    <ActivityIndicator color="#34D399" />
                </View>
            );
        }

        if (player.image) {
            return (
                <TouchableOpacity onPress={() => handleCapturePlayerImage(player.id)}>
                    <Image 
                        source={{ uri: player.image }} 
                        style={styles.playerIcon}
                    />
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity 
                style={styles.playerIconPlaceholder}
                onPress={() => handleCapturePlayerImage(player.id)}
            >
                <Text style={styles.uploadText}>+</Text>
            </TouchableOpacity>
        );
    };

    const renderPlayerItem = ({ item }: { item: Player }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {renderPlayerIcon(item)}
                <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{item.name} {item.surname}</Text>
                    <Text style={styles.playerDetails}>
                        {item.position} | #{item.jersey_number} | {item.age} años
                    </Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity 
                            style={styles.editButton}
                            onPress={() => handleEditPlayer(item)}
                        >
                            <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.statsButton}
                            onPress={() => handleEditStatistics(item)}
                        >
                            <Text style={styles.statsButtonText}>Estadísticas</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeletePlayer(item.id)}
                >
                    <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#34D399" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={players}
                style={styles.list}
                renderItem={renderPlayerItem}
                keyExtractor={item => item.id.toString()}
            />
            
            <CameraComponent
                visible={showCamera}
                onClose={() => setShowCamera(false)}
                onTakePhoto={handlePhotoTaken}
            />

            {selectedPlayer && (
                <PlayerStatisticsModal
                    visible={showStatistics}
                    onClose={() => {
                        setShowStatistics(false);
                        setSelectedPlayer(null);
                    }}
                    playerId={selectedPlayer.id}
                    playerName={`${selectedPlayer.name} ${selectedPlayer.surname}`}
                    initialStatistics={statistics.find(s => s.player === selectedPlayer.id)}
                />
            )}

            {selectedPlayer && (
                <PlayerEditModal
                    visible={showEditPlayer}
                    onClose={() => {
                        setShowEditPlayer(false);
                        setSelectedPlayer(null);
                        fetchPlayers();
                    }}
                    player={selectedPlayer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerIconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    uploadText: {
        fontSize: 24,
        color: '#666',
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 10,
    },
    deleteButton: {
        padding: 8,
    },
    deleteText: {
        color: '#ff4444',
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 20,
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
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
    playerInfo: {
        flex: 1,
        marginLeft: 10,
    },
    statsButton: {
        backgroundColor: '#3498db',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    statsButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    playerDetails: {
        color: '#666',
        fontSize: 14,
    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 5,
        gap: 10,
    },
    editButton: {
        backgroundColor: '#f39c12',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    editButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    
});

export default PlayersManagementScreen;