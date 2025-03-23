
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList, BottomTabParamList } from './types';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { UserProvider } from './context/UserContext';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <UserProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
                </Stack.Navigator>
                <StatusBar style="auto" />
            </NavigationContainer>
        </UserProvider>
    );
};