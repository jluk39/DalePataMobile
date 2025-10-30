import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SeguimientoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="event" size={64} color={theme.colors.primary} />
        <Text style={styles.title}>Seguimiento</Text>
        <Text style={styles.subtitle}>Próximamente...</Text>
        <Text style={styles.description}>
          Aquí podrás ver el historial y seguimiento de tus adopciones y turnos veterinarios.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
});
