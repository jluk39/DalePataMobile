import UserProtectedRoute from '@/components/UserProtectedRoute'
import { HeaderBar } from '@/components/home/HeaderBar'
import { HeroSection } from '@/components/home/HeroSection'
import { MyPetsGrid } from '@/components/home/MyPetsGrid'
import { theme } from '@/constants/theme'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <UserProtectedRoute>
      <SafeAreaView style={styles.container} edges={['top']}>
        <HeaderBar />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <HeroSection />
          <MyPetsGrid />
        </ScrollView>
      </SafeAreaView>
    </UserProtectedRoute>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
})
