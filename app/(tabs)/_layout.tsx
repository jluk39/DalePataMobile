import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: '#89C7A8',  // Color activo
        tabBarInactiveTintColor: '#33332D', // oklch(0.2 0 0) ≈ #33332D
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#89C7A8',  // Fondo verde
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          paddingHorizontal: 8,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          marginHorizontal: 2,
          borderRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarActiveBackgroundColor: '#33332D', // Fondo oscuro cuando está activo
        tabBarInactiveBackgroundColor: 'transparent',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size || 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Adoptar',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="pets" size={size || 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perdidos"
        options={{
          title: 'Perdidos',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-on" size={size || 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="seguimiento"
        options={{
          title: 'Seguimiento',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={size || 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notificaciones"
        options={{
          href: null, // Ocultar del tab bar, solo accesible desde el botón del header
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Ocultar la pantalla original index
        }}
      />
    </Tabs>
  );
}
