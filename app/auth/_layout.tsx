import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#89C7A8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Iniciar Sesión',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Registro',
          headerShown: true,
        }} 
      />
    </Stack>
  )
}
