// src/navigation/MainNavigation.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


// Screens
import TeamsScreen from '../screens/main/TeamsScreen';
import MatchesScreen from '../screens/main/MatchesScreen';
import StatisticsScreen from '../screens/main/StatsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();


export const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Inicio':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Equipos':
                            iconName = focused ? 'shield' : 'shield-outline';
                            break;
                        case 'Partidos':
                            iconName = focused ? 'soccer' : 'soccer-field';
                            break;
                        case 'Estadísticas':
                            iconName = focused ? 'chart-bar' : 'chart-bar-stacked';
                            break;
                        case 'Perfil':
                            iconName = focused ? 'account' : 'account-outline';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0404e2',
                tabBarInactiveTintColor: 'White',
                tabBarActiveBackgroundColor: '#1f1e1e',
                tabBarInactiveBackgroundColor:'#1f1e1e',
            })}
        >
            <Tab.Screen
                name="Teams"
                component={TeamsScreen}
                options={{ title: 'Equipos' }}
            />
            <Tab.Screen
                name="Matches"
                component={MatchesScreen}
                options={{ title: 'Partidos' }}
            />
            <Tab.Screen
                name="Statistics"
                component={StatisticsScreen}
                options={{ title: 'Estadisticas' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Perfil' }}
            />
        </Tab.Navigator>
    );
};