import { useState, useEffect } from 'react';
import { supabase } from '../lib/createClient';
import { Statistics } from '../types';

export const useStatistics = () => {
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
        const { data, error } = await supabase
        .from('statistics')
        .select('*');

        if (error) throw error;
        setStatistics(data || []);
    } catch (error) {
        console.error('Error fetching statistics:', error);
    } finally {
        setLoading(false);
    }
    };


  const createStatistics = async (statsData: Partial<Statistics>) => {
    try {
      const { data, error } = await supabase
        .from('statistics')
        .insert([statsData])
        .select()
        .single();

      if (error) throw error;
    //   await fetchStatistics();
      return data;
    } catch (error) {
      console.error('Error creating statistics:', error);
      throw error;
    }
  };

  const updateStatistics = async (id: number, statsData: Partial<Statistics>) => {
    try {
      const { error } = await supabase
        .from('statistics')
        .update(statsData)
        .eq('id', id);

      if (error) throw error;
    //   await fetchStatistics();
    } catch (error) {
      console.error('Error updating statistics:', error);
      throw error;
    }
  };

  const deleteStatistics = async (id: number) => {
    try {
      const { error } = await supabase
        .from('statistics')
        .delete()
        .eq('id', id);

      if (error) throw error;
    //   await fetchStatistics();
    } catch (error) {
      console.error('Error deleting statistics:', error);
      throw error;
    }
  };

  return { statistics, loading, createStatistics, updateStatistics, deleteStatistics, fetchStatistics };
};