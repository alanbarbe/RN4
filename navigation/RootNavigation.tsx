import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/authContext';
import { MainNavigator } from './MainNavigation';
import { AuthNavigator } from './AuthNavigation';
import { AdminNavigator } from './AdminNavigation';
import { TeamOrPlayerNavigation } from './TeamOrPlayerNavigation';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, isAdmin, isTeamOrPlayer } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: '#1f1e1e' }, 
        headerStyle: { backgroundColor: '#1f1e1e' },  
        headerTintColor: '#fff',                      
      }}
    >
      {!user ? (
        <Stack.Screen name="Torneo" component={AuthNavigator} />
      ) : isAdmin ? (
        <Stack.Screen name="Admin" component={AdminNavigator} />
      ) : isTeamOrPlayer ? (
        <Stack.Screen name="Main" component={TeamOrPlayerNavigation} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};
