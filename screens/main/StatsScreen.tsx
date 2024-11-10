import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../../lib/createClient';
import { Player, Statistics } from '../../types';
import { useStatistics } from '../../hooks/useStatistics';
import { usePlayers } from '../../hooks/usePlayers';
import { useTeams } from '../../hooks/useTeams';

const PlayerStatsScreen = () => {
    const [sortBy, setSortBy] = useState<keyof Statistics>('goals');
    const { statistics, loading, fetchStatistics } = useStatistics();
    const { players, fetchPlayers } = usePlayers();
    const {teams, fetchTeams} = useTeams();
    const [sortedStats, setSortedStats] = useState<Statistics[]>([]);
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);

    useEffect(() => {
        if (statistics.length > 0) {
            const sorted = [...statistics].sort((a, b) => {
                if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
                    return (b[sortBy] as number) - (a[sortBy] as number);
                }
                return 0;
            });
            setSortedStats(sorted);
        }
    }, [sortBy, statistics]);

    useEffect(() => {
        fetchPlayers();
        fetchTeams();
        fetchStatistics();
    }, []);

    const handleSort = (key: keyof Statistics) => {
        setSortBy(key);
        const sorted = [...statistics].sort((a, b) => {
            if (typeof a[key] === 'number' && typeof b[key] === 'number') {
                return (b[key] as number) - (a[key] as number);
            }
            return 0;
        });
        setSortedStats(sorted);
    };

    const getPlayerInfo = (playerId: number) => {
        const player = players.find(team => team.id === playerId);
        return {
            id: player?.id || 0,
            name: player?.name || 'Nombre no encontrado',
            surname: player?.surname || '',
            age: player?.age || 0,
            position: player?.position || '',
            team: typeof player?.team === 'number' ? player.team : 0,
            image: player?.image || '',
            jersey_number: player?.jersey_number || 0,
            created_at: player?.created_at || '',
            user_id: player?.user_id !== undefined && player?.user_id !== null ? player.user_id.toString() : '0',
        };
    };

    const getTeamInfo = (teamId: number) => {
        const team = teams.find(team => team.id === teamId);
        return {
            name: team?.name || 'Equipo no encontrado',
        };
    };

    const renderSortButton = (title: string, key: keyof Statistics) => (
        <TouchableOpacity
            style={[styles.sortButton, sortBy === key && styles.activeSortButton]}
            onPress={() => handleSort(key)}
        >
            <Text style={[styles.sortButtonText, sortBy === key && styles.activeSortButtonText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

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
                <TouchableOpacity>
                    <Image 
                        source={{ uri: player.image }} 
                        style={styles.playerIcon}
                    />
                </TouchableOpacity>
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Estadísticas de Jugadores</Text>

                <View style={styles.sortContainer}>
                    {renderSortButton('Goles', 'goals')}
                    {renderSortButton('Asistencias', 'assistances')}
                    {renderSortButton('Amarillas', 'yellow_cards')}
                    {renderSortButton('Rojas', 'red_cards')}
                </View>

                {sortedStats.map((stat) => {
                    const player = getPlayerInfo(stat.player);
                    const team = getTeamInfo(Number(player.team));
                    
                    return (
                        <View key={stat.id} style={styles.card}>
                            <View style={styles.card__playerInfo}>
                                {renderPlayerIcon(player)}
                                <Text style={styles.cardTitle}>{player.name} - {team.name}</Text>
                            </View>
                            <View style={styles.statsContainer}>
                                <Text style={styles.statItem}>Goles: {stat.goals}</Text>
                                <Text style={styles.statItem}>Asistencias: {stat.assistances}</Text>
                                <Text style={styles.statItem}>Amarillas: {stat.yellow_cards}</Text>
                                <Text style={styles.statItem}>Rojas: {stat.red_cards}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
        width: '48%',
    },
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    sortButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    activeSortButton: {
        backgroundColor: '#0000ff',
    },
    sortButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeSortButtonText: {
        color: 'white',
    },
    playerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card__playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap : 10,
    },
});

export default PlayerStatsScreen;