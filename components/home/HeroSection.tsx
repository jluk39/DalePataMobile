import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import React from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import { Button } from '../ui/Button'

export function HeroSection() {
  const router = useRouter()
  const { user } = useAuth()

  const handleExplorarMascotas = () => {
    router.push('/(tabs)/explore')
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/golden-retriever-dog-happy.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.image}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>
              {user ? `¡Hola, ${user.nombre}!` : '¡Hola!'}
            </Text>
            <Text style={styles.subtitle}>Encontrá tu nueva mascota</Text>
            <Button onPress={handleExplorarMascotas} size="lg" style={styles.button}>
              Explorar Mascotas
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    height: 200,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    borderRadius: theme.borderRadius.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(137, 199, 168, 0.85)', // primary con 85% opacity
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  content: {
    maxWidth: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primaryForeground,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primaryForeground,
    marginBottom: theme.spacing.lg,
  },
  button: {
    alignSelf: 'flex-start',
  },
})
