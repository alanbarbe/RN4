import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useMatches } from '../../hooks/useMatches';
import { useTeams } from '../../hooks/useTeams';
import { Match } from '../../types';

const MatchesScreen = () => {
    const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
    const { teams, fetchTeams } = useTeams();
    const { fetchMatches, matches } = useMatches();

    useEffect(() => {
        fetchMatches();
        fetchTeams();
    }, []);

    useEffect(() => {
        if (matches.length > 0) {
            const upcoming = matches.filter((match) => new Date(match.date) > new Date());
            setUpcomingMatches(upcoming);
        }
    }, [matches]);

    const getTeamInfo = (teamId: number) => {
        const team = teams.find(team => team.id === teamId);
        return {
            name: team?.name || 'Team not found',
            shield: team?.team_shield || 'https://via.placeholder.com/50'

        };
    };

    return (
        <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Fixture</Text>
        {matches.map((match, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.teamContainer}>
                <Image source={{ uri: getTeamInfo(match.local_team).shield }} style={styles.shield} />
                <Text style={styles.teamName}>{getTeamInfo(match.local_team).name}</Text>
              </View>
              <Text style={styles.vsText}>vs</Text>
              <View style={styles.teamContainer}>
                <Image source={{ uri: getTeamInfo(match.away_team).shield }} style={styles.shield} />
                <Text style={styles.teamName}>{getTeamInfo(match.away_team).name}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>{match.date}</Text>
              <Text style={styles.cardText}>{match.stadium}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.title, { marginTop: 20 }]}>Próximos Partidos</Text>
        {upcomingMatches.map((match, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.teamContainer}>
                <Image source={{ uri: getTeamInfo(match.local_team).shield }} style={styles.shield} />
                <Text style={styles.teamName}>{getTeamInfo(match.local_team).name}</Text>
              </View>
              <Text style={styles.vsText}>vs</Text>
              <View style={styles.teamContainer}>
                <Image source={{ uri: getTeamInfo(match.away_team).shield }} style={styles.shield} />
                <Text style={styles.teamName}>{getTeamInfo(match.away_team).name}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>{match.date}</Text>
              <Text style={styles.cardText}>{match.stadium}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
      container: {
        flex: 1,
        padding: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        paddingBottom: 8,
        marginBottom: 8,
      },
      teamContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      shield: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
      },
      teamName: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      vsText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 8,
      },
      cardContent: {
      },
      cardText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
      },
});

export default MatchesScreen;