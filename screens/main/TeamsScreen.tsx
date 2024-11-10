import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTeams } from '../../hooks/useTeams';
import { Team } from '../../types';

const TeamsScreen = () => {
  const { teams, fetchTeams } = useTeams();

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Equipos</Text>

        {teams.map((team) => (
          <TouchableOpacity key={team.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: team.team_shield }} style={styles.shield} />
              <Text style={styles.cardTitle}>{team.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shield: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
});

export default TeamsScreen;