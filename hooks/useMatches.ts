import { useState, useEffect } from 'react';
import { supabase } from '../lib/createClient';
import { Match } from '../types';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*');
      
      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMatch = async (matchData: Partial<Match>) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([matchData])
        .single();

      if (error) throw error;
      fetchMatches();
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const updateMatch = async (id: number, matchData: Partial<Match>) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update(matchData)
        .eq('id', id);

      if (error) throw error;
      fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const deleteMatch = async (id: number) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return { matches, loading, createMatch, updateMatch, deleteMatch, fetchMatches };
};
