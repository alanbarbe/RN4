import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/authContext';
import { MainNavigator } from './MainNavigation';
import { AuthNavigator } from './AuthNavigation';
import { AdminNavigator } from './AdminNavigation';
import { TeamOrPlayerNavigation} from './TeamOrPlayerNavigation';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, isAdmin, isTeamOrPlayer } = useAuth();


  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      ) : (
        <>
        {
            isAdmin ? (
                // Admin Stack
                <>
                <Stack.Screen name="Admin" component={AdminNavigator} />
                </>
            ) : (

                isTeamOrPlayer ? (
                    // Team or Player Stack
                    <>
                    <Stack.Screen name="Main" component={TeamOrPlayerNavigation} />
                    </>
                ) : (
                    // Default Stack
                    <>
                    <Stack.Screen name="Main" component={MainNavigator} />
                    </>
                )


            )
        }
        </>
      )}
    </Stack.Navigator>
  );
};
