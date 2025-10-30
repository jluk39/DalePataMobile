import { useRouter } from 'expo-router';
import { useEffect } from 'react';

/**
 * Esta pantalla es un redirect automático a /home
 * No debe mostrarse nunca al usuario
 */
export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a home
    router.replace('/(tabs)/home');
  }, [router]);

  return null; // No renderizar nada
}

