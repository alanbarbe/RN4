import { useState, useEffect } from 'react';
import { supabase } from '../lib/createClient';
import { Team } from '../types';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*');
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: Partial<Team>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([teamData])
        .single();

      if (error) throw error;
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const updateTeam = async (id: number, teamData: Partial<Team>) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id);

      if (error) throw error;
      fetchTeams();
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const deleteTeam = async (id: number) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return { teams, loading, createTeam, updateTeam, deleteTeam, fetchTeams };
};