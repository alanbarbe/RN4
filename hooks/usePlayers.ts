import { useState, useEffect } from 'react';
import { supabase } from '../lib/createClient';
import { Player } from '../types';

export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`*`);
      
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPlayer = async (playerData: Partial<Player>) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([playerData])
        .select()
        .single();

      if (error) throw error;
    //   await fetchPlayers
      return data;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  };

  const updatePlayer = async (id: number, playerData: Partial<Player>) => {
    try {
      const { error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', id);

      if (error) throw error;
    //   await fetchPlayers();
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  };

  const deletePlayer = async (id: number) => {
    try {
      // First, delete associated statistics
      const { error: statsError } = await supabase
        .from('statistics')
        .delete()
        .eq('player', id);

      if (statsError) throw statsError;

      // Then, delete the player
      const { error: playerError } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (playerError) throw playerError;

      await fetchPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  };

  return { players, loading, fetchPlayers,createPlayer, updatePlayer, deletePlayer };
};