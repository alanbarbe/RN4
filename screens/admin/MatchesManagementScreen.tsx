import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Match, Team } from '../../types';
import { useTeams } from '../../hooks/useTeams';
import { supabase } from '../../lib/createClient';
import { useMatches } from '../../hooks/useMatches';

const MatchesManagementScreen = () => {
    const { teams, loading: teamsLoading, fetchTeams } = useTeams();
    const [localTeam, setLocalTeam] = useState<number | undefined>(undefined);
    const [awayTeam, setAwayTeam] = useState<number | undefined>(undefined);
    const [stadium, setStadium] = useState<string>('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [localTeamGoals, setLocalTeamGoals] = useState<string>('');
    const [awayTeamGoals, setAwayTeamGoals] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { matches, createMatch, updateMatch, fetchMatches } = useMatches();
    const [editingMatch, setEditingMatch] = useState<Match | null>(null);

    useEffect(() => {
        fetchMatches();
        fetchTeams();
    }, []);

    const getTeamInfo = (teamId: number) => {
        const team = teams.find(team => team.id === teamId);
        return {
            name: team?.name || 'Equipo no encontrado',
            shield: team?.team_shield || 'https://via.placeholder.com/50'
        };
    };

    const handleDeleteMatch = async (matchId: number) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro que deseas eliminar este partido?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('matches')
                                .delete()
                                .eq('id', matchId);

                            if (error) throw error;
                            fetchMatches();
                            Alert.alert("Éxito", "El partido ha sido eliminado correctamente");
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el partido. Por favor intente nuevamente");
                        }
                    }
                }
            ]
        );
    };

    const handleAddOrUpdateMatch = async () => {
        if (!localTeam || !awayTeam || !stadium || !date) {
            Alert.alert("Error", "Por favor complete todos los campos");
            return;
        }

        const matchData = {
            local_team: localTeam,
            away_team: awayTeam,
            stadium,
            date: date.toISOString().split('T')[0],
            local_team_goals: localTeamGoals ? parseInt(localTeamGoals) : undefined,
            away_team_goals: awayTeamGoals ? parseInt(awayTeamGoals) : undefined,
        };

        try {
            if (editingMatch) {
                await updateMatch(editingMatch.id, matchData);
                Alert.alert("¡Éxito!", "El partido se ha actualizado correctamente");
            } else {
                await createMatch(matchData);
                Alert.alert("¡Éxito!", "El partido se ha programado correctamente");
            }

            setLocalTeam(undefined);
            setAwayTeam(undefined);
            setStadium('');
            setDate(undefined);
            setLocalTeamGoals('');
            setAwayTeamGoals('');
            setEditingMatch(null);
            fetchMatches();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el partido. Por favor intente nuevamente");
        }
    };

    const handleEditMatch = (match: Match) => {
        setEditingMatch(match);
        setLocalTeam(match.local_team);
        setAwayTeam(match.away_team);
        setStadium(match.stadium);
        setDate(new Date(match.date));
        setLocalTeamGoals(match.local_team_goals?.toString() || '');
        setAwayTeamGoals(match.away_team_goals?.toString() || '');
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Picker
                    selectedValue={localTeam}
                    onValueChange={(itemValue) => setLocalTeam(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Seleccionar equipo local" value={undefined} />
                    {!teamsLoading && teams.map((team) => (
                        <Picker.Item key={team.id} label={team.name} value={team.id} />
                    ))}
                </Picker>

                <Picker
                    selectedValue={awayTeam}
                    onValueChange={(itemValue) => setAwayTeam(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Seleccionar equipo visitante" value={undefined} />
                    {!teamsLoading && teams.map((team) => (
                        <Picker.Item key={team.id} label={team.name} value={team.id} />
                    ))}
                </Picker>

                <TextInput
                    style={styles.input}
                    placeholder="Ingresar estadio"
                    value={stadium}
                    onChangeText={setStadium}
                />

                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.buttonText}>
                        {date ? date.toDateString() : "Seleccionar Fecha"}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                {
                    editingMatch && (
                        <View style={styles.goalsContainer}>
                            <TextInput
                                style={styles.goalsInput}
                                placeholder="Goles equipo local"
                                value={localTeamGoals}
                                onChangeText={setLocalTeamGoals}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.goalsInput}
                                placeholder="Goles equipo visitante"
                                value={awayTeamGoals}
                                onChangeText={setAwayTeamGoals}
                                keyboardType="numeric"
                            />
                        </View>

                    )
                }

                <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdateMatch}>
                    <Text style={styles.buttonText}>
                        {editingMatch ? "Actualizar Partido" : "Programar Partido"}
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={matches}
                style={styles.list}
                renderItem={({ item }) => {
                    const localTeam = getTeamInfo(item.local_team);
                    const awayTeam = getTeamInfo(item.away_team);

                    return (
                        <View style={styles.card}>
                            <View style={styles.matchHeader}>
                                <Text style={styles.dateText}>
                                    {new Date(item.date).toLocaleDateString()}
                                </Text>
                                <Text style={styles.stadiumText}>{item.stadium}</Text>
                            </View>
                            <View style={styles.matchContent}>
                                <View style={styles.teamContainer}>
                                    <Image
                                        source={{ uri: localTeam.shield }}
                                        style={styles.shield}
                                    />
                                    <Text style={styles.teamText}>
                                        {localTeam.name}
                                    </Text>
                                    <Text style={styles.scoreText}>
                                        {item.local_team_goals ?? '-'}
                                    </Text>
                                </View>
                                <Text style={styles.vsText}>vs</Text>
                                <View style={styles.teamContainer}>
                                    <Image
                                        source={{ uri: awayTeam.shield }}
                                        style={styles.shield}
                                    />
                                    <Text style={styles.teamText}>
                                        {awayTeam.name}
                                    </Text>
                                    <Text style={styles.scoreText}>
                                        {item.away_team_goals ?? '-'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => handleEditMatch(item)}
                                >
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteMatch(item.id)}
                                >
                                    <Text style={styles.deleteText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No hay partidos programados
                        </Text>
                    </View>
                )}
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
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    dateButton: {
        backgroundColor: '#f1f1f1',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
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
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    matchContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    stadiumText: {
        fontSize: 14,
        color: '#666',
    },
    teamText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    vsText: {
        fontSize: 16,
        color: '#666',
    },
    teamContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
    shield: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        padding: 8,
        backgroundColor: '#3498db',
        borderRadius: 5,
    },
    editText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 8,
    },
    deleteText: {
        color: '#ff4444',
        fontWeight: 'bold',
    },
    goalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    goalsInput: {
        flex: 1,
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginRight: 5,
    },
});

export default MatchesManagementScreen;