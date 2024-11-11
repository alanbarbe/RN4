// src/navigation/MainNavigation.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/authContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Admin Screens
import TeamsManagementScreen from '../screens/admin/TeamsManagementScreen';
import PlayersManagementScreen from '../screens/admin/PlayersManagementScreen';
import MatchesManagementScreen from '../screens/admin/MatchesManagementScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';

const Tab = createBottomTabNavigator();


export const AdminNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Teams':
                            iconName = focused ? 'shield' : 'shield-outline';
                            break;
                        case 'Matches':
                            iconName = focused ? 'soccer' : 'soccer-field';
                            break;
                        case 'Statistics':
                            iconName = focused ? 'chart-bar' : 'chart-bar-stacked';
                            break;
                        case 'Profile':
                            iconName = focused ? 'account' : 'account-outline';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0404e2',
                tabBarInactiveTintColor: 'white',
                tabBarActiveBackgroundColor: '#1f1e1e',
                tabBarInactiveBackgroundColor:'#1f1e1e',
            })}
        >
            <Tab.Screen
                name="Home"
                component={PlayersManagementScreen}
                options={{ title: 'Inicio' }}
            />
            <Tab.Screen
                name="Teams"
                component={TeamsManagementScreen}
                options={{ title: 'Equipos' }}
            />
            <Tab.Screen
                name="Matches"
                component={MatchesManagementScreen}
                options={{ title: 'Partidos' }}
            />
            <Tab.Screen
                name="Profile"
                component={UsersManagementScreen}
                options={{ title: 'Usuarios' }}
            />
        </Tab.Navigator>
    );
};