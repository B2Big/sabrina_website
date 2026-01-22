import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calculator, MapPin } from 'lucide-react-native';
import { View } from 'react-native';

import CalculatorScreen from './src/screens/CalculatorScreen';
import TrackerScreen from './src/screens/TrackerScreen';
import Metronome from './src/components/Metronome';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: '#09090B' }}>
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#18181B',
                    borderTopColor: '#27272A',
                    height: 90,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#71717A',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    paddingBottom: 10,
                }
            }}
        >
            <Tab.Screen 
                name="Calculator" 
                component={CalculatorScreen} 
                options={{
                    tabBarIcon: ({ color }) => <Calculator color={color} size={28} />,
                    tabBarLabel: 'VMA Calc'
                }}
            />
            <Tab.Screen 
                name="Tracker" 
                component={TrackerScreen} 
                options={{
                    tabBarIcon: ({ color }) => <MapPin color={color} size={28} />,
                    tabBarLabel: 'Live Run'
                }}
            />
        </Tab.Navigator>
        
        {/* Persistent Metronome Overlay */}
        <View style={{ position: 'absolute', bottom: 100, width: '100%', paddingHorizontal: 20 }}>
            <Metronome />
        </View>
      </View>
    </NavigationContainer>
  );
}