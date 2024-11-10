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
                tabBarInactiveTintColor: 'gray',
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