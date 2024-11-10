import { useState, useEffect } from 'react';
import { supabase } from '../lib/createClient';
import { User } from '../types';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*');

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData: Partial<User>) => {
        try {

            const { data, error } = await supabase
                .from('users')
                .insert([{ ...userData }]) // Using the auth user id
                .select()
                .single();

            if (error) throw error;

            await fetchUsers();
            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    };

    const updateUser = async (id: number, userData: Partial<User>) => {
        try {
            const { error } = await supabase
                .from('users')
                .update(userData)
                .eq('id', id);

            if (error) throw error;
            await fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const deleteUser = async (id: number) => {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };

    
    return { users, loading, createUser, updateUser, deleteUser, fetchUsers };
};