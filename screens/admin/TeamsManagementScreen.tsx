import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useTeams } from '../../hooks/useTeams';
import { Team } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../utils/storage';

const TeamsManagementScreen = () => {
    const { teams, loading, createTeam, updateTeam, deleteTeam, fetchTeams  } = useTeams();
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);


    useEffect(() => {
        fetchTeams();
    }, []);

    const handleDeleteTeam = (teamId: number) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro que deseas eliminar este equipo?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => deleteTeam(teamId)
                }
            ]
        );
    };

    const handleUpdateTeamImage = async (teamId: number) => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (permissionResult.granted === false) {
                alert('Se necesita permiso para acceder a la galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets[0]) {
                setUploadingImage(teamId.toString());
                const imageUri = result.assets[0].uri;
                try {
                    const publicUrl = await uploadImage(imageUri, 'team-shields');
                    
                    if (publicUrl) {
                        await updateTeam(Number(teamId), { team_shield: publicUrl });
                    }
                } catch (error) {
                    console.error('Error al actualizar la imagen:', error);
                    alert(error instanceof Error ? error.message : 'Error al actualizar la imagen');
                } finally {
                    setUploadingImage(null);
                }
            }
        } catch (error) {
            console.error('Error al seleccionar imagen:', error);
            alert('Error al seleccionar la imagen');
            setUploadingImage(null);
        }
    };

    const renderTeamIcon = (team: Team) => {
        if (uploadingImage == team.id.toString()) {
            return (
                <View style={styles.teamIcon}>
                    <ActivityIndicator color="#34D399" />
                </View>
            );
        }

        if (team.team_shield) {
            return (
                <TouchableOpacity onPress={() => handleUpdateTeamImage(team.id)}>
                    <Image 
                        source={{ uri: team.team_shield }} 
                        style={styles.teamIcon}
                    />
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity 
                style={styles.teamIconPlaceholder}
                onPress={() => handleUpdateTeamImage(team.id)}
            >
                <Text style={styles.uploadText}>+</Text>
            </TouchableOpacity>
        );
    };

    const handleEditTeam = (team: Team) => {
        setEditingTeam(team);
    };

    const handleSaveTeamName = async (teamId: number, newName: string) => {
        try {
            await updateTeam(teamId, { name: newName });
            setEditingTeam(null);
        } catch (error) {
            console.error('Error updating team name:', error);
            Alert.alert('Error', 'No se pudo actualizar el nombre del equipo');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={teams}
                style={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            {renderTeamIcon(item)}
                            {editingTeam && editingTeam.id === item.id ? (
                                <TextInput
                                    style={styles.editInput}
                                    value={editingTeam.name}
                                    onChangeText={(text) => setEditingTeam({ ...editingTeam, name: text })}
                                    onBlur={() => handleSaveTeamName(item.id, editingTeam.name)}
                                    autoFocus
                                />
                            ) : (
                                <TouchableOpacity onPress={() => handleEditTeam(item)}>
                                    <Text style={styles.teamName}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity 
                                style={styles.deleteButton}
                                onPress={() => handleDeleteTeam(item.id)}
                            >
                                <Text style={styles.deleteText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    addButton: {
        backgroundColor: '#34D399',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
    teamIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamIconPlaceholder: {
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
    teamName: {
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
    editInput: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#34D399',
        padding: 0,
    },
});

export default TeamsManagementScreen;

