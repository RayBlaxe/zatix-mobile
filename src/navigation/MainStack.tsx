import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../types';
import ScannerScreen from '../screens/main/ScannerScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import CustomTabBar from '../components/CustomTabBar';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          tabBarLabel: 'Scanner',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}