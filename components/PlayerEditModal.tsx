import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Player, Team } from '../types';
import { usePlayers } from '../hooks/usePlayers';
import { useTeams } from '../hooks/useTeams';
import { Picker } from '@react-native-picker/picker';

interface PlayerEditModalProps {
    visible: boolean;
    onClose: () => void;
    player: Player;
}

const PlayerEditModal = ({ visible, onClose, player }: PlayerEditModalProps) => {
    const { updatePlayer } = usePlayers();
    const { teams, loading: teamsLoading } = useTeams();
    const [editedPlayer, setEditedPlayer] = useState<Player>(player);

    const handleSave = async () => {
        try {
            await updatePlayer(player.id, editedPlayer);
            Alert.alert('Éxito', 'Información del jugador actualizada correctamente');
            onClose();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la información del jugador');
        }
    };

    const handleChange = (field: keyof Player, value: string | number) => {
        setEditedPlayer(prev => ({
            ...prev,
            [field]: field === 'age' || field === 'jersey_number' ? parseInt(value as string) || 0 : value
        }));
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Editar Jugador</Text>
                    
                    <ScrollView style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                value={editedPlayer.name}
                                onChangeText={(value) => handleChange('name', value)}
                                placeholder="Nombre del jugador"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Apellido</Text>
                            <TextInput
                                style={styles.input}
                                value={editedPlayer.surname}
                                onChangeText={(value) => handleChange('surname', value)}
                                placeholder="Apellido del jugador"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Número de Camiseta</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={editedPlayer.jersey_number?.toString()}
                                onChangeText={(value) => handleChange('jersey_number', value)}
                                placeholder="Número de camiseta"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Edad</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={editedPlayer.age?.toString()}
                                onChangeText={(value) => handleChange('age', value)}
                                placeholder="Edad del jugador"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Posición</Text>
                            <TextInput
                                style={styles.input}
                                value={editedPlayer.position}
                                onChangeText={(value) => handleChange('position', value)}
                                placeholder="Posición del jugador"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Equipo</Text>
                            {teamsLoading ? (
                                <Text>Cargando equipos...</Text>
                            ) : (
                                <Picker
                                    selectedValue={editedPlayer.team}
                                    onValueChange={(itemValue) => handleChange('team', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Seleccionar equipo" value={undefined} />
                                    {teams.map((team: Team) => (
                                        <Picker.Item key={team.id} label={team.name} value={team.id} />
                                    ))}
                                </Picker>
                            )}
                        </View>

                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    form: {
        maxHeight: 400,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#ff4444',
    },
    saveButton: {
        backgroundColor: '#34D399',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
    },
});

export default PlayerEditModal;