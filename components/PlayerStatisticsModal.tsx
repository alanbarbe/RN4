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
import { Statistics } from '../types';
import { useStatistics } from '../hooks/useStatistics';

interface PlayerStatisticsModalProps {
    visible: boolean;
    onClose: () => void;
    playerId: number;
    initialStatistics?: Statistics;
    playerName?: string;
}

const PlayerStatisticsModal = ({
    visible,
    onClose,
    playerId,
    initialStatistics,
    playerName,
}: PlayerStatisticsModalProps) => {
    const { createStatistics, updateStatistics } = useStatistics();
    const [statistics, setStatistics] = useState<Partial<Statistics>>(
        initialStatistics || {
            player: playerId,
            goals: 0,
            assistances: 0,
            yellow_cards: 0,
            red_cards: 0,
        }
    );

    const handleSave = async () => {
        try {
            if (initialStatistics?.id) {
                await updateStatistics(initialStatistics.id, statistics);
                Alert.alert('Éxito', 'Estadísticas actualizadas correctamente');
            } else {
                await createStatistics(statistics);
                Alert.alert('Éxito', 'Estadísticas creadas correctamente');
            }
            onClose();
        } catch (error) {
            Alert.alert('Error', 'No se pudieron guardar las estadísticas');
        }
    };

    const handleChange = (field: keyof Statistics, value: string) => {
        setStatistics(prev => ({
            ...prev,
            [field]: parseInt(value) || 0
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
                    <Text style={styles.modalTitle}>
                        {playerName ? `Estadísticas de ${playerName}` : 'Estadísticas del Jugador'}
                    </Text>
                    
                    <ScrollView style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Goles</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={statistics.goals?.toString()}
                                onChangeText={(value) => handleChange('goals', value)}
                                placeholder="0"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Asistencias</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={statistics.assistances?.toString()}
                                onChangeText={(value) => handleChange('assistances', value)}
                                placeholder="0"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tarjetas Amarillas</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={statistics.yellow_cards?.toString()}
                                onChangeText={(value) => handleChange('yellow_cards', value)}
                                placeholder="0"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tarjetas Rojas</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={statistics.red_cards?.toString()}
                                onChangeText={(value) => handleChange('red_cards', value)}
                                placeholder="0"
                            />
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
});

export default PlayerStatisticsModal;